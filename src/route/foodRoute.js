const express = require('express');
const router = express.Router();
const {
    getFoods, 
    foodsRecommendation, 
    getFoodById, 
    createFood, 
    updateFood, 
    deleteFood 
} = require('../controller/foodController');

// 📦 READ operations
router.get('/', getFoods);
router.get('/recommended', foodsRecommendation);
router.get('/:foodId', getFoodById);

// ✏️ CREATE / UPDATE / DELETE
router.post('/', createFood);
router.patch('/:foodId', updateFood);
router.delete('/:foodId', deleteFood);

module.exports = router;