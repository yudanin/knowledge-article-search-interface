/**
 * Categories Routes
 * GET /api/v1/categories - List all categories
 */

const express = require('express');
const router = express.Router();
const { categories } = require('../data/articles');

/**
 * GET /categories
 * List all available categories with article counts
 */
router.get('/', (req, res) => {
  res.json({ categories });
});

module.exports = router;
