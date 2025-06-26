import { CreateUserRequest, UserRole } from '../../types/index.js';

export const validUserData: CreateUserRequest = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'Password123',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.USER,
};

export const adminUserData: CreateUserRequest = {
  email: 'admin@example.com',
  username: 'admin',
  password: 'AdminPass123',
  firstName: 'Admin',
  lastName: 'User',
  role: UserRole.ADMIN,
};

export const moderatorUserData: CreateUserRequest = {
  email: 'moderator@example.com',
  username: 'moderator',
  password: 'ModeratorPass123',
  firstName: 'Moderator',
  lastName: 'User',
  role: UserRole.MODERATOR,
};

export const invalidUserData = {
  email: 'invalid-email',
  username: 'ab', // too short
  password: '123', // too short
  firstName: '',
  lastName: '',
};

export const duplicateEmailData: CreateUserRequest = {
  email: 'test@example.com', // same as validUserData
  username: 'differentuser',
  password: 'Password123',
  firstName: 'Different',
  lastName: 'User',
  role: UserRole.USER,
};

export const duplicateUsernameData: CreateUserRequest = {
  email: 'different@example.com',
  username: 'testuser', // same as validUserData
  password: 'Password123',
  firstName: 'Different',
  lastName: 'User',
  role: UserRole.USER,
};

export const updateUserData = {
  firstName: 'Updated',
  lastName: 'Name',
  email: 'updated@example.com',
};

export const loginData = {
  email: 'test@example.com',
  password: 'Password123',
};

export const invalidLoginData = {
  email: 'test@example.com',
  password: 'wrongpassword',
};

export const changePasswordData = {
  currentPassword: 'Password123',
  newPassword: 'NewPassword123',
};

export const invalidChangePasswordData = {
  currentPassword: 'wrongpassword',
  newPassword: 'NewPassword123',
};
