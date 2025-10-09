const AppError = require('../util/AppError');
const { failure } = require('../util/response');

exports.routeNotFound = (req, res, next) => {
  throw new AppError('Route not found', 404);
};
