const express = require('express');
const { OrderDB } = require('../models/Order');
const router = express.Router();

// GET DASHBOARD STATS
router.get('/', (req, res) => {
  try {
    const stats = OrderDB.getStats();
    
    res.json({
      success: true,
      dashboard: {
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        ordersByStatus: stats.ordersByStatus,
        averageOrderValue: stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : 0
      },
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET DETAILED ANALYTICS
router.get('/analytics', (req, res) => {
  try {
    const allOrders = OrderDB.getAll();
    
    const analytics = {
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((sum, order) => sum + order.totalBill, 0),
      ordersByStatus: {},
      topCustomers: {},
      peakOrderTime: null,
      lastUpdated: new Date()
    };

    // Orders by status
    allOrders.forEach(order => {
      if (!analytics.ordersByStatus[order.status]) {
        analytics.ordersByStatus[order.status] = { count: 0, revenue: 0 };
      }
      analytics.ordersByStatus[order.status].count++;
      analytics.ordersByStatus[order.status].revenue += order.totalBill;
    });

    // Top customers
    allOrders.forEach(order => {
      if (!analytics.topCustomers[order.customerName]) {
        analytics.topCustomers[order.customerName] = { orders: 0, spent: 0 };
      }
      analytics.topCustomers[order.customerName].orders++;
      analytics.topCustomers[order.customerName].spent += order.totalBill;
    });

    // Sort top customers by spending
    const sortedCustomers = Object.entries(analytics.topCustomers)
      .sort((a, b) => b[1].spent - a[1].spent)
      .slice(0, 5);
    
    analytics.topCustomers = Object.fromEntries(sortedCustomers);

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
