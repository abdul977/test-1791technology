import { Request, Response } from 'express';
import { Order, Product } from '../models/index.js';
import { ApiResponse, PaginationMeta, CreateOrderRequest, UpdateOrderRequest, OrderStatus } from '../types/index.js';
import { asyncHandler, NotFoundError, ForbiddenError, ValidationError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

// Get all orders (Admin/Moderator can see all, users see only their own)
export const getOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { 
    page = 1, 
    limit = 10, 
    sort = 'createdAt', 
    order = 'desc',
    status,
    userId,
    startDate,
    endDate,
    minAmount,
    maxAmount
  } = req.query;

  // Build filter object
  const filter: any = {};

  // Filter by userId if provided
  if (userId) {
    filter.userId = userId;
  }
  
  if (status) {
    filter.status = status;
  }
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }
  
  if (minAmount || maxAmount) {
    filter.totalAmount = {};
    if (minAmount) filter.totalAmount.$gte = parseFloat(minAmount as string);
    if (maxAmount) filter.totalAmount.$lte = parseFloat(maxAmount as string);
  }

  // Calculate pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object
  const sortObj: any = {};
  sortObj[sort as string] = order === 'asc' ? 1 : -1;

  // Execute queries
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'name sku')
      .lean(),
    Order.countDocuments(filter),
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
    data: orders,
    meta,
    message: 'Orders retrieved successfully',
  };

  res.status(200).json(response);
});

// Get order by ID
export const getOrderById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('userId', 'firstName lastName email')
    .populate('items.productId', 'name sku price');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Order access is now open to all

  const response: ApiResponse = {
    success: true,
    data: order.toJSON(),
    message: 'Order retrieved successfully',
  };

  res.status(200).json(response);
});

// Create order
export const createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const orderData: CreateOrderRequest = req.body;

  // Authentication removed - orders can be created by anyone

  // Validate products and calculate totals
  const productIds = orderData.items.map(item => item.productId);
  const products = await Product.find({ 
    _id: { $in: productIds }, 
    isActive: true 
  });

  if (products.length !== productIds.length) {
    throw new ValidationError('One or more products not found or inactive');
  }

  // Check stock availability and validate prices
  const validatedItems = orderData.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      throw new ValidationError(`Product ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new ValidationError(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
    }

    // Use current product price
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
      total: item.quantity * product.price,
    };
  });

  // Create order
  const order = new Order({
    userId: orderData.userId || 'anonymous', // Allow anonymous orders or use provided userId
    items: validatedItems,
    totalAmount: validatedItems.reduce((sum, item) => sum + item.total, 0),
    shippingAddress: orderData.shippingAddress,
    billingAddress: orderData.billingAddress,
    paymentMethod: orderData.paymentMethod,
  });

  await order.save();

  // Update product stock
  for (const item of validatedItems) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } }
    );
  }

  // Populate order for response
  await order.populate('items.productId', 'name sku');

  // Log order creation
  logger.info(`Order created: ${order.id}`, {
    orderId: order.id,
    userId: order.userId,
    totalAmount: order.totalAmount,
    itemCount: order.items.length,
  });

  const response: ApiResponse = {
    success: true,
    data: order.toJSON(),
    message: 'Order created successfully',
  };

  res.status(201).json(response);
});

// Update order status (Admin/Moderator only)
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  const oldStatus = order.status;
  order.status = status;
  await order.save();

  // If order is cancelled, restore product stock
  if (status === OrderStatus.CANCELLED && oldStatus !== OrderStatus.CANCELLED) {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }
  }

  // Log status update
  logger.info(`Order status updated: ${order.id}`, {
    orderId: order.id,
    oldStatus,
    newStatus: status,
  });

  const response: ApiResponse = {
    success: true,
    data: order.toJSON(),
    message: 'Order status updated successfully',
  };

  res.status(200).json(response);
});

// Update order (limited fields)
export const updateOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates: UpdateOrderRequest = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Allow updates for all orders
  // Note: In a production system, you might want to add business logic here

  // Update order
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  ).populate('items.productId', 'name sku');

  // Log order update
  logger.info(`Order updated: ${id}`, {
    orderId: id,
    updates: Object.keys(updates),
  });

  const response: ApiResponse = {
    success: true,
    data: updatedOrder?.toJSON(),
    message: 'Order updated successfully',
  };

  res.status(200).json(response);
});

// Cancel order
export const cancelOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  // Allow cancellation for all orders

  // Can only cancel pending or confirmed orders
  if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
    throw new ForbiddenError('Order cannot be cancelled in current status');
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();

  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: item.quantity } }
    );
  }

  // Log order cancellation
  logger.info(`Order cancelled: ${order.id}`, {
    orderId: order.id,
  });

  const response: ApiResponse = {
    success: true,
    data: order.toJSON(),
    message: 'Order cancelled successfully',
  };

  res.status(200).json(response);
});

// Get order statistics (Admin/Moderator only)
export const getOrderStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const [
    totalOrders,
    ordersByStatus,
    totalRevenue,
    averageOrderValue,
    recentOrders
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Order.aggregate([
      { $match: { status: { $ne: OrderStatus.CANCELLED } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.aggregate([
      { $match: { status: { $ne: OrderStatus.CANCELLED } } },
      { $group: { _id: null, avg: { $avg: '$totalAmount' } } }
    ]),
    Order.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    })
  ]);

  const stats = {
    totalOrders,
    ordersByStatus: ordersByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>),
    totalRevenue: totalRevenue[0]?.total || 0,
    averageOrderValue: averageOrderValue[0]?.avg || 0,
    recentOrders,
  };

  const response: ApiResponse = {
    success: true,
    data: stats,
    message: 'Order statistics retrieved successfully',
  };

  res.status(200).json(response);
});
