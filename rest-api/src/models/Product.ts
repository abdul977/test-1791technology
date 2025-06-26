import mongoose, { Schema, Document } from 'mongoose';
import { Product as IProduct } from '../types/index.js';

// Extend the Product interface to include Mongoose Document methods
export interface ProductDocument extends Omit<IProduct, 'id'>, Document {
  toJSON(): IProduct;
}

// Product schema definition
const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [1000, 'Product description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: function (value: number) {
          return Number.isFinite(value) && value >= 0;
        },
        message: 'Price must be a valid positive number',
      },
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      validate: {
        validator: function (value: number) {
          return Number.isInteger(value) && value >= 0;
        },
        message: 'Stock must be a non-negative integer',
      },
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z0-9-_]+$/,
        'SKU can only contain uppercase letters, numbers, hyphens, and underscores',
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 10;
        },
        message: 'Cannot have more than 10 images',
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 20;
        },
        message: 'Cannot have more than 20 tags',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
// Note: sku index is automatically created due to unique: true
productSchema.index({ isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ stock: 1 });

// Compound indexes
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });

// Static method to find active products
productSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, isActive: true });
};

// Static method to find products by category
productSchema.statics.findByCategory = function (category: string) {
  return this.find({ category, isActive: true });
};

// Static method to find products in stock
productSchema.statics.findInStock = function (filter = {}) {
  return this.find({ ...filter, stock: { $gt: 0 }, isActive: true });
};

// Static method to search products
productSchema.statics.search = function (query: string) {
  return this.find({
    $text: { $search: query },
    isActive: true,
  }).sort({ score: { $meta: 'textScore' } });
};

// Virtual for availability status
productSchema.virtual('isAvailable').get(function () {
  return this.isActive && this.stock > 0;
});

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function () {
  return `$${this.price.toFixed(2)}`;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure SKU is uppercase
productSchema.pre('save', function (next) {
  if (this.isModified('sku')) {
    this.sku = this.sku.toUpperCase();
  }
  next();
});

// Create and export the model
const Product = mongoose.model<ProductDocument>('Product', productSchema);

export default Product;
