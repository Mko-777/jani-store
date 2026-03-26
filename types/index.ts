export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  stripePaymentId: string;
  status: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  shippingMethod: string;
  createdAt: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  days: string;
  price: number;
  carrier: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}
