import { Request, Response } from 'express';
import { Product } from '../models/index.js';
import { ApiResponse, PaginationMeta, CreateProductRequest, UpdateProductRequest } from '../types/index.js';
import { asyncHandler, NotFoundError, ConflictError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

// Get all products
export const getProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    sortBy, // Accept frontend naming
    order = 'desc',
    sortOrder, // Accept frontend naming
    q,
    search, // Accept frontend naming
    category,
    minPrice,
    maxPrice,
    inStock,
    isActive = 'true'
  } = req.query;

  // Handle both naming conventions
  const actualSort = sortBy || sort || 'createdAt';
  const actualOrder = sortOrder || order || 'desc';
  const searchQuery = search || q;

  // Build filter object
  const filter: any = {};

  // Show active products by default
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  } else {
    filter.isActive = true; // Default to showing only active products
  }

  if (category && typeof category === 'string' && category.trim() !== '') {
    filter.category = { $regex: category, $options: 'i' };
  }
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
  }
  
  if (inStock === 'true') {
    filter.stock = { $gt: 0 };
  }
  
  // Text search - handle both parameter names
  if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== '') {
    filter.$text = { $search: searchQuery };
  }

  // Calculate pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object - use unified sort parameters
  const sortObj: any = {};
  if (searchQuery && filter.$text) {
    sortObj.score = { $meta: 'textScore' };
  } else {
    sortObj[actualSort as string] = actualOrder === 'asc' ? 1 : -1;
  }

  // Execute queries
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const meta: PaginationMeta = {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages,
    hasNext: pageNum < totalPages,
    hasPrev: pageNum > 1,
  };

  const response: ApiResponse = {
    success: true,
    data: products,
    meta,
    message: 'Products retrieved successfully',
  };

  res.status(200).json(response);
});

// Get product by ID
export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const filter: any = { _id: id };
  
  // Show only active products by default
  filter.isActive = true;

  const product = await Product.findOne(filter);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  const response: ApiResponse = {
    success: true,
    data: product.toJSON(),
    message: 'Product retrieved successfully',
  };

  res.status(200).json(response);
});

// Create product (Admin/Moderator only)
export const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productData: CreateProductRequest = req.body;

  // Check if SKU already exists
  const existingProduct = await Product.findOne({ sku: productData.sku.toUpperCase() });
  if (existingProduct) {
    throw new ConflictError('SKU already exists');
  }

  // Create new product
  const product = new Product(productData);
  await product.save();

  // Log product creation
  logger.info(`Product created: ${product.name}`, {
    productId: product.id,
    sku: product.sku,
  });

  const response: ApiResponse = {
    success: true,
    data: product.toJSON(),
    message: 'Product created successfully',
  };

  res.status(201).json(response);
});

// Update product (Admin/Moderator only)
export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates: UpdateProductRequest = req.body;

  // Find product
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Check for SKU conflict if SKU is being updated
  if (updates.sku && updates.sku !== product.sku) {
    const existingProduct = await Product.findOne({ 
      sku: updates.sku.toUpperCase(),
      _id: { $ne: id }
    });
    if (existingProduct) {
      throw new ConflictError('SKU already exists');
    }
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );

  // Log product update
  logger.info(`Product updated: ${updatedProduct?.name}`, {
    productId: id,
    updates: Object.keys(updates),
  });

  const response: ApiResponse = {
    success: true,
    data: updatedProduct?.toJSON(),
    message: 'Product updated successfully',
  };

  res.status(200).json(response);
});

// Delete product (Admin only)
export const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Soft delete by deactivating the product
  product.isActive = false;
  await product.save();

  // Log product deletion
  logger.info(`Product deactivated: ${product.name}`, {
    productId: id,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Product deactivated successfully',
  };

  res.status(200).json(response);
});

// Get product categories
export const getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = await Product.distinct('category', { isActive: true });

  const response: ApiResponse = {
    success: true,
    data: categories.sort(),
    message: 'Categories retrieved successfully',
  };

  res.status(200).json(response);
});

// Search products
export const searchProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    const response: ApiResponse = {
      success: true,
      data: [],
      message: 'Search query is required',
    };
    res.status(200).json(response);
    return;
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const filter: any = {
    $text: { $search: q as string },
    isActive: true,
  };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);
  const meta: PaginationMeta = {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages,
    hasNext: pageNum < totalPages,
    hasPrev: pageNum > 1,
  };

  const response: ApiResponse = {
    success: true,
    data: products,
    meta,
    message: 'Search completed successfully',
  };

  res.status(200).json(response);
});

// Get product statistics (Admin/Moderator only)
export const getProductStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const [
    totalProducts,
    activeProducts,
    outOfStockProducts,
    productsByCategory,
    averagePrice
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: 0, isActive: true }),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ])
  ]);

  const stats = {
    totalProducts,
    activeProducts,
    inactiveProducts: totalProducts - activeProducts,
    outOfStockProducts,
    productsByCategory: productsByCategory.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>),
    averagePrice: averagePrice[0]?.avgPrice || 0,
  };

  const response: ApiResponse = {
    success: true,
    data: stats,
    message: 'Product statistics retrieved successfully',
  };

  res.status(200).json(response);
});
