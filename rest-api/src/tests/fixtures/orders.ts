import { CreateOrderRequest, OrderStatus, Address } from '../../types/index.js';

export const validShippingAddress: Address = {
  street: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zipCode: '12345',
  country: 'USA',
};

export const validBillingAddress: Address = {
  street: '456 Oak Ave',
  city: 'Somewhere',
  state: 'NY',
  zipCode: '67890',
  country: 'USA',
};

export const createValidOrderData = (productId: string): CreateOrderRequest => ({
  items: [
    {
      productId,
      quantity: 2,
      price: 99.99,
    },
  ],
  shippingAddress: validShippingAddress,
  billingAddress: validBillingAddress,
  paymentMethod: 'Credit Card',
});

export const createMultiItemOrderData = (productIds: string[]): CreateOrderRequest => ({
  items: productIds.map((productId, index) => ({
    productId,
    quantity: index + 1,
    price: (index + 1) * 50,
  })),
  shippingAddress: validShippingAddress,
  billingAddress: validBillingAddress,
  paymentMethod: 'PayPal',
});

export const invalidOrderData = {
  items: [], // empty items array
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: 'invalid', // invalid zip code
    country: '',
  },
  billingAddress: validBillingAddress,
  paymentMethod: '',
};

export const orderWithInvalidProductData = {
  items: [
    {
      productId: '507f1f77bcf86cd799439011', // non-existent product ID
      quantity: 1,
      price: 99.99,
    },
  ],
  shippingAddress: validShippingAddress,
  billingAddress: validBillingAddress,
  paymentMethod: 'Credit Card',
};

export const orderWithExcessiveQuantityData = (productId: string): CreateOrderRequest => ({
  items: [
    {
      productId,
      quantity: 1000, // more than available stock
      price: 99.99,
    },
  ],
  shippingAddress: validShippingAddress,
  billingAddress: validBillingAddress,
  paymentMethod: 'Credit Card',
});

export const updateOrderStatusData = {
  status: OrderStatus.CONFIRMED,
};

export const updateOrderAddressData = {
  shippingAddress: {
    street: '789 New Street',
    city: 'New City',
    state: 'TX',
    zipCode: '54321',
    country: 'USA',
  },
};

export const orderStatuses = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];
