const FoodService = require("../service/foodService");
const { catchAsync } = require("../libs/util/catchAsync")

// 📦 READ operations
exports.getFoods = catchAsync(async (req, res, next) => {
    const result = await FoodService.getFoods();
    return res.ok(result, 200);
});

exports.foodsRecommendation = catchAsync(async (req, res, next) => {
    const { userId } = req.body;

    const result = await FoodService.foodsRecommendation(userId);
    return res.ok(result, 200);
});

exports.getFoodById = catchAsync(async (req, res, next) => {
    const { foodId } = req.params;

    const result = await FoodService.getFoodById(foodId);
    return res.ok(result, 200);
});

// ✏️ CREATE / UPDATE / DELETE
exports.createFood = catchAsync(async (req, res, next) => {
    const foodInfo = { ...req.body };

    const result = await FoodService.createFood(foodInfo);
    return res.ok(result, 201);
});

exports.updateFood = catchAsync(async (req, res, next) => {
    const { foodId } = req.params;
    const foodInfo = { ...req.body }

    const result = await FoodService.updateFood(foodId, foodInfo);
    return res.ok(result, 200);
});

exports.deleteFood = catchAsync(async (req, res, next) => {
    const result = await FoodService.deleteFood(foodId);
    return res.ok(result, 200);
});