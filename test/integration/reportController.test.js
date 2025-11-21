const request = require('supertest');
const express = require('express');

// We'll mock the service module used by controller so controllers return consistent data
jest.mock('../../src/service/reportService', () => ({
  getTotalUsers: jest.fn().mockResolvedValue({ totalUsers: 42 }),
  getNewUsersOverTime: jest.fn().mockResolvedValue([{ date: new Date('2025-11-01'), count: 3 }]),
  getActiveUsersSummary: jest.fn().mockResolvedValue({ total: 100, active: 80, activePercent: 80 }),
  countUnverifiedEmails: jest.fn().mockResolvedValue({ unverified: 5 }),
  genderDistribution: jest.fn().mockResolvedValue({ total: 100, breakdown: [{ gender: 'male', count: 60 }] }),
  ageDistribution: jest.fn().mockResolvedValue({ total: 90, breakdown: [{ bucket: '18-25', count: 30 }] }),
  avgHeightWeightByGender: jest.fn().mockResolvedValue([{ gender: 'male', avgHeight: 175, avgWeight: 75 }]),
  goalDistribution: jest.fn().mockResolvedValue({ total: 100, breakdown: [{ goal: 'build_muscle', count: 20 }] }),
  totalFoods: jest.fn().mockResolvedValue({ total: 500 }),
  foodsByCategory: jest.fn().mockResolvedValue([{ category: 'fruits', count: 50 }]),
  foodsByMeal: jest.fn().mockResolvedValue([{ meal: 'breakfast', count: 100 }]),
  newFoodsPerMonth: jest.fn().mockResolvedValue([{ date: new Date('2025-10-01'), count: 12 }]),
  topFoodsByCalories: jest.fn().mockResolvedValue([{ name: 'BigBurger', calories: 1200 }]),
  foodsWithMostAllergens: jest.fn().mockResolvedValue([{ name: 'AllerMix', allergensCount: 5 }]),
  getTodayTotals: jest.fn().mockResolvedValue({ calories: 1500, protein: 80, carb: 150, fat: 50 }),
  caloriesByMealToday: jest.fn().mockResolvedValue([{ mealType: 'lunch', calories: 700 }]),
  recentLoggedFoods: jest.fn().mockResolvedValue([{ id: '1', calories: 500 }]),
  timeSeriesCaloriesAndMacros: jest.fn().mockResolvedValue([{ date: new Date('2025-11-01'), calories: 1800, protein: 90, carb: 200, fat: 60 }]),
  perMealAnalysis: jest.fn().mockResolvedValue({ perMeal: [], highestCalories: null, lowestProtein: null }),
  topFoodsPerMeal: jest.fn().mockResolvedValue([{ meal: 'lunch', foods: [] }]),
  estimateDailyCalories: jest.fn().mockReturnValue(2200)
}));

const reportController = require('../../src/controller/reportController');

describe('reportController endpoints', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    // mount endpoints but add a small middleware to set req.user
    app.get('/admin/overview', (req, res, next) => { req.user = { id: 'admin1', role: 'admin' }; next(); }, reportController.adminOverview);
    app.get('/user/summary', (req, res, next) => { req.user = { id: 'user1', weight: 70, height: 175, age: 30, gender: 'male', activity: 'moderately_active', goal: 'maintain_weight' }; next(); }, reportController.userDashboardToday);
  });

  it('GET /admin/overview returns aggregated admin overview', async () => {
    const res = await request(app).get('/admin/overview');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalUsers).toBeDefined();
  });

  it('GET /user/summary returns user dashboard', async () => {
    const res = await request(app).get('/user/summary');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totals).toBeDefined();
    expect(res.body.data.recommended).toBeDefined();
  });
});
