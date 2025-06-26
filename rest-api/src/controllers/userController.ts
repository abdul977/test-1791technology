import { Request, Response } from 'express';
import { User } from '../models/index.js';
import { ApiResponse, PaginationMeta, UpdateUserRequest } from '../types/index.js';
import { asyncHandler, NotFoundError, ConflictError, ForbiddenError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

// Get all users (Admin only)
export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', role, isActive, search } = req.query;

  // Build filter object
  const filter: any = {};
  
  if (role) {
    filter.role = role;
  }
  
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }
  
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object
  const sortObj: any = {};
  sortObj[sort as string] = order === 'asc' ? 1 : -1;

  // Execute queries
  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
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
    data: users,
    meta,
    message: 'Users retrieved successfully',
  };

  res.status(200).json(response);
});

// Get user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const response: ApiResponse = {
    success: true,
    data: user.toJSON(),
    message: 'User retrieved successfully',
  };

  res.status(200).json(response);
});

// Create user (Admin only)
export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userData = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      { email: userData.email },
      { username: userData.username }
    ]
  });

  if (existingUser) {
    if (existingUser.email === userData.email) {
      throw new ConflictError('Email already registered');
    } else {
      throw new ConflictError('Username already taken');
    }
  }

  // Create new user
  const user = new User(userData);
  await user.save();

  // Log user creation
  logger.info(`User created: ${user.email}`, {
    userId: user.id,
  });

  const response: ApiResponse = {
    success: true,
    data: user.toJSON(),
    message: 'User created successfully',
  };

  res.status(201).json(response);
});

// Update user
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates: UpdateUserRequest = req.body;

  // Find user
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Allow updates for all users

  // Check for email/username conflicts if they're being updated
  if (updates.email || updates.username) {
    const conflictQuery: any = {
      _id: { $ne: id },
      $or: [],
    };

    if (updates.email) {
      conflictQuery.$or.push({ email: updates.email });
    }
    if (updates.username) {
      conflictQuery.$or.push({ username: updates.username });
    }

    const existingUser = await User.findOne(conflictQuery);
    if (existingUser) {
      if (existingUser.email === updates.email) {
        throw new ConflictError('Email already in use');
      } else {
        throw new ConflictError('Username already taken');
      }
    }
  }

  // Allow all field updates

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );

  // Log user update
  logger.info(`User updated: ${updatedUser?.email}`, {
    userId: id,
    updates: Object.keys(updates),
  });

  const response: ApiResponse = {
    success: true,
    data: updatedUser?.toJSON(),
    message: 'User updated successfully',
  };

  res.status(200).json(response);
});

// Delete user (Admin only)
export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Allow deletion of any user

  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Soft delete by deactivating the user instead of removing from database
  user.isActive = false;
  await user.save();

  // Log user deletion
  logger.info(`User deactivated: ${user.email}`, {
    userId: id,
  });

  const response: ApiResponse = {
    success: true,
    message: 'User deactivated successfully',
  };

  res.status(200).json(response);
});

// Activate user (Admin only)
export const activateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.isActive = true;
  await user.save();

  // Log user activation
  logger.info(`User activated: ${user.email}`, {
    userId: id,
  });

  const response: ApiResponse = {
    success: true,
    data: user.toJSON(),
    message: 'User activated successfully',
  };

  res.status(200).json(response);
});

// Get user statistics (Admin only)
export const getUserStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const [totalUsers, activeUsers, usersByRole] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const stats = {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    usersByRole: usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>),
  };

  const response: ApiResponse = {
    success: true,
    data: stats,
    message: 'User statistics retrieved successfully',
  };

  res.status(200).json(response);
});
