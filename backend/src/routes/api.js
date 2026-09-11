const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const aiRoutes = require('./aiRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const outfitRoutes = require('./outfitRoutes');
const cartRoutes = require('./cartRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const orderRoutes = require('./orderRoutes');
const searchRoutes = require('./searchRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const reviewRoutes = require('./reviewRoutes');
const couponRoutes = require('./couponRoutes');
const styleRoutes = require('./styleRoutes');
const adminCustomerRoutes = require('./adminCustomerRoutes');
const uploadRoutes = require('./uploadRoutes');
const settingRoutes = require('./settingRoutes');
const paymentRoutes = require('./paymentRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const { sendSuccess } = require('../utils/response');

// Health-check endpoint
router.get('/health', (req, res) => {
  return sendSuccess(
    res,
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Routine Web API',
      version: '1.4.0',
    },
    'Routine Web Backend is operational'
  );
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/ai', aiRoutes);
// Alias hỗ trợ tương thích ngược cho endpoint smart-outfit/ai-stylist
router.use('/smart-outfit/ai-stylist', (req, res, next) => {
  req.url = '/chat';
  return aiRoutes(req, res, next);
});
router.use('/categories', categoryRoutes);
router.use('/styles', styleRoutes);
router.use('/products', productRoutes);
router.use('/outfits', outfitRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/search', searchRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/admin/customers', adminCustomerRoutes);
router.use('/upload', uploadRoutes);
router.use('/settings', settingRoutes);
router.use('/payment', paymentRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
