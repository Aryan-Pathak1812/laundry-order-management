const express = require('express');
const { OrderDB, GARMENT_PRICING, ORDER_STATUSES } = require('../models/Order');
const router = express.Router();

// Validation middleware
const validateOrderInput = (req, res, next) => {
  const { customerName, phoneNumber, garments } = req.body;

  if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
    return res.status(400).json({ error: 'Valid customer name is required' });
  }

  if (!phoneNumber || typeof phoneNumber !== 'string' || !/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
  }

  if (!Array.isArray(garments) || garments.length === 0) {
    return res.status(400).json({ error: 'At least one garment is required' });
  }

  for (const garment of garments) {
    if (!garment.type || !GARMENT_PRICING[garment.type]) {
      return res.status(400).json({
        error: `Invalid garment type: ${garment.type}. Allowed types: ${Object.keys(GARMENT_PRICING).join(', ')}`
      });
    }
    if (!Number.isInteger(garment.quantity) || garment.quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }
  }

  next();
};

// CREATE ORDER
router.post('/', validateOrderInput, (req, res) => {
  try {
    const { customerName, phoneNumber, garments } = req.body;
    const order = OrderDB.create(customerName, phoneNumber, garments);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: order.toJSON(),
      pricing: GARMENT_PRICING
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL ORDERS
router.get('/', (req, res) => {
  try {
    const { status, customerName, phoneNumber } = req.query;
    let orders;

    if (status) {
      if (!Object.values(ORDER_STATUSES).includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Allowed: ${Object.values(ORDER_STATUSES).join(', ')}`
        });
      }
      orders = OrderDB.getByStatus(status);
    } else if (customerName) {
      orders = OrderDB.getByCustomerName(customerName);
    } else if (phoneNumber) {
      orders = OrderDB.getByPhoneNumber(phoneNumber);
    } else {
      orders = OrderDB.getAll();
    }

    res.json({
      success: true,
      count: orders.length,
      orders: orders,
      filters: { status, customerName, phoneNumber }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ORDER BY ID
router.get('/:orderId', (req, res) => {
  try {
    const order = OrderDB.getById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({
      success: true,
      order: order.toJSON()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE ORDER STATUS
router.patch('/:orderId/status', (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedOrder = OrderDB.updateStatus(req.params.orderId, status);
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE ORDER
router.delete('/:orderId', (req, res) => {
  try {
    const deleted = OrderDB.delete(req.params.orderId);
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET AVAILABLE GARMENTS & PRICING
router.get('/config/garments', (req, res) => {
  res.json({
    success: true,
    garments: GARMENT_PRICING,
    availableStatuses: ORDER_STATUSES
  });
});

module.exports = router;
