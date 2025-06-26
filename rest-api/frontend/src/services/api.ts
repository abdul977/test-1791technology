import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type {
  User,
  Product,
  Order,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  ProductFilters,
  OrderFilters,
  UserStats,
  ProductStats,
  OrderStats
} from '../types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
  private requestCache = new Map<string, Promise<any>>();

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.data.accessToken);
              
              // Retry the original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.logout();
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data?.errors,
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0,
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  }

  // Request deduplication helper
  private async dedupedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key);
    }

    const promise = requestFn().finally(() => {
      // Remove from cache after request completes
      setTimeout(() => this.requestCache.delete(key), 1000);
    });

    this.requestCache.set(key, promise);
    return promise;
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/login', credentials);
    
    // Store tokens
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/register', userData);
    
    // Store tokens
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
    const response: AxiosResponse<ApiResponse<{ accessToken: string }>> = await this.client.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get('/auth/profile');
    return response.data.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.put('/auth/profile', userData);
    return response.data.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.client.put('/auth/change-password', { oldPassword, newPassword });
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Product endpoints
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const cacheKey = `products-${params.toString()}`;
    return this.dedupedRequest(cacheKey, async () => {
      const response: AxiosResponse<PaginatedResponse<Product>> = await this.client.get(
        `/products?${params.toString()}`
      );
      return response.data;
    });
  }

  async getProduct(id: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.client.get(`/products/${id}`);
    return response.data.data;
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.client.post('/products', productData);
    return response.data.data;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.client.put(`/products/${id}`, productData);
    return response.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.client.delete(`/products/${id}`);
  }

  async getCategories(): Promise<string[]> {
    return this.dedupedRequest('categories', async () => {
      const response: AxiosResponse<ApiResponse<string[]>> = await this.client.get('/products/categories');
      return response.data.data;
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response: AxiosResponse<ApiResponse<Product[]>> = await this.client.get(`/products/search?q=${query}`);
    return response.data.data;
  }

  async getProductStats(): Promise<ProductStats> {
    const response: AxiosResponse<ApiResponse<ProductStats>> = await this.client.get('/products/stats');
    return response.data.data;
  }

  // Order endpoints
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response: AxiosResponse<PaginatedResponse<Order>> = await this.client.get(
      `/orders?${params.toString()}`
    );
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.client.get(`/orders/${id}`);
    return response.data.data;
  }

  async createOrder(orderData: { items: { productId: string; quantity: number }[] }): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.client.post('/orders', orderData);
    return response.data.data;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.client.put(`/orders/${id}/status`, { status });
    return response.data.data;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.client.put(`/orders/${id}/cancel`);
    return response.data.data;
  }

  async getOrderStats(): Promise<OrderStats> {
    const response: AxiosResponse<ApiResponse<OrderStats>> = await this.client.get('/orders/stats');
    return response.data.data;
  }

  // User endpoints (admin only)
  async getUsers(filters?: { page?: number; limit?: number; role?: string }): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response: AxiosResponse<PaginatedResponse<User>> = await this.client.get(
      `/users?${params.toString()}`
    );
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.get(`/users/${id}`);
    return response.data.data;
  }

  async createUser(userData: RegisterData): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.post('/users', userData);
    return response.data.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.client.put(`/users/${id}`, userData);
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }

  async getUserStats(): Promise<UserStats> {
    const response: AxiosResponse<ApiResponse<UserStats>> = await this.client.get('/users/stats');
    return response.data.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

export const apiClient = new ApiClient();
export default apiClient;
