const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

// Bank Melli IPG Configuration
const BANK_MELLI_CONFIG = {
  merchantId: process.env.BANK_MELLI_MERCHANT_ID,
  apiKey: process.env.BANK_MELLI_API_KEY,
  terminalId: process.env.BANK_MELLI_TERMINAL_ID,
  paymentGatewayUrl: 'https://gateway.bankmelli.ir/pay',
  verificationUrl: 'https://gateway.bankmelli.ir/verify',
};

// Create payment request
router.post('/create-payment', async (req, res) => {
  try {
    const { orderId, amount, returnUrl } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Create payment request to Bank Melli
    const paymentData = {
      merchantId: BANK_MELLI_CONFIG.merchantId,
      terminalId: BANK_MELLI_CONFIG.terminalId,
      amount: Math.round(amount * 10),
      orderId: orderId,
      description: `Order ${order.orderNumber}`,
      returnUrl: returnUrl || `${process.env.FRONTEND_URL}/payment-callback`,
      callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/callback`,
    };

    // Send to Bank Melli
    const response = await axios.post(BANK_MELLI_CONFIG.paymentGatewayUrl, paymentData, {
      headers: {
        'x-api-key': BANK_MELLI_CONFIG.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      res.json({
        success: true,
        paymentUrl: response.data.paymentUrl,
        trackingCode: response.data.trackingCode,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment gateway error',
      });
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Payment callback
router.post('/callback', async (req, res) => {
  try {
    const { trackingCode, orderId, amount, status, transactionId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify payment with Bank Melli
    const verifyData = {
      merchantId: BANK_MELLI_CONFIG.merchantId,
      terminalId: BANK_MELLI_CONFIG.terminalId,
      trackingCode,
      amount: Math.round(amount * 10),
    };

    const verifyResponse = await axios.post(
      BANK_MELLI_CONFIG.verificationUrl,
      verifyData,
      {
        headers: {
          'x-api-key': BANK_MELLI_CONFIG.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (verifyResponse.data.verified) {
      order.paymentStatus = 'completed';
      order.transactionId = transactionId;
      order.orderStatus = 'processing';
      await order.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;