const AppError = require("../util/AppError");

const whiteList = ['http://localhost:3000']

exports.corsConfig = {
    origin: ((origin, callback) => {
        if (!origin || whiteList.includes(origin)) return callback(null, true);
        callback(new AppError("Not allowed by CORS", 403));
    }), 
    credentials: true
}