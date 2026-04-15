const { v4: uuidv4 } = require('uuid');

// In-memory database
const orders = {};

// Garment pricing configuration
const GARMENT_PRICING = {
  'Shirt': 150,
  'Pants': 200,
  'Saree': 300,
  'Kurta': 250,
  'Dupatta': 100,
  'Jacket': 350,
  'Coat': 400,
  'Jeans': 200,
  'Skirt': 180,
  'Dress': 250
};

const ORDER_STATUSES = {
  RECEIVED: 'RECEIVED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  DELIVERED: 'DELIVERED'
};

class Order {
  constructor(customerName, phoneNumber, garments) {
    this.orderId = uuidv4().slice(0, 8).toUpperCase();
    this.customerName = customerName;
    this.phoneNumber = phoneNumber;
    this.garments = garments; // Array of {type, quantity}
    this.status = ORDER_STATUSES.RECEIVED;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.totalBill = this.calculateBill();
  }

  calculateBill() {
    return this.garments.reduce((total, item) => {
      const price = GARMENT_PRICING[item.type] || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  updateStatus(newStatus) {
    if (!Object.values(ORDER_STATUSES).includes(newStatus)) {
      throw new Error(`Invalid status. Allowed: ${Object.values(ORDER_STATUSES).join(', ')}`);
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      orderId: this.orderId,
      customerName: this.customerName,
      phoneNumber: this.phoneNumber,
      garments: this.garments,
      status: this.status,
      totalBill: this.totalBill,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// Database operations
const OrderDB = {
  create: (customerName, phoneNumber, garments) => {
    const order = new Order(customerName, phoneNumber, garments);
    orders[order.orderId] = order;
    return order;
  },

  getById: (orderId) => {
    return orders[orderId] || null;
  },

  getAll: () => {
    return Object.values(orders).map(order => order.toJSON());
  },

  getByStatus: (status) => {
    return Object.values(orders)
      .filter(order => order.status === status)
      .map(order => order.toJSON());
  },

  getByCustomerName: (name) => {
    return Object.values(orders)
      .filter(order => order.customerName.toLowerCase().includes(name.toLowerCase()))
      .map(order => order.toJSON());
  },

  getByPhoneNumber: (phone) => {
    return Object.values(orders)
      .filter(order => order.phoneNumber === phone)
      .map(order => order.toJSON());
  },

  updateStatus: (orderId, newStatus) => {
    const order = orders[orderId];
    if (!order) return null;
    order.updateStatus(newStatus);
    return order.toJSON();
  },

  delete: (orderId) => {
    if (orders[orderId]) {
      delete orders[orderId];
      return true;
    }
    return false;
  },

  getStats: () => {
    const allOrders = Object.values(orders);
    const stats = {
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((sum, order) => sum + order.totalBill, 0),
      ordersByStatus: {}
    };

    Object.values(ORDER_STATUSES).forEach(status => {
      stats.ordersByStatus[status] = allOrders.filter(order => order.status === status).length;
    });

    return stats;
  }
};

module.exports = {
  Order,
  OrderDB,
  GARMENT_PRICING,
  ORDER_STATUSES
};
