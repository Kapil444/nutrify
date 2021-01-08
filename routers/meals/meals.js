const express = require('express');
const router = express.Router();
const mealsController = require('../../controller/meals/mealsController');
const checkAuth = require('../../middleware/middleware');

router.post('/create',mealsController.createMeals);

router.get('/get/by/username',mealsController.getMealByUserName);

router.post('/update/:id',mealsController.updateMeals);

router.delete('/delete',mealsController.deleteMeals);

module.exports = router;