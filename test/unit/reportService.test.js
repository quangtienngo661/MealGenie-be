const reportService = require('../../src/service/reportService');
const User = require('../../src/model/userModel');

describe('reportService.getNewUsersOverTime', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns aggregated results from User.aggregate', async () => {
    const sample = [
      { date: new Date('2025-11-01T00:00:00Z'), count: 5 },
      { date: new Date('2025-11-02T00:00:00Z'), count: 3 }
    ];
    jest.spyOn(User, 'aggregate').mockResolvedValue(sample);
    const rows = await reportService.getNewUsersOverTime({ groupBy: 'day' });
    expect(Array.isArray(rows)).toBe(true);
    expect(rows[0].count).toBe(5);
    expect(User.aggregate).toHaveBeenCalled();
  });
});
