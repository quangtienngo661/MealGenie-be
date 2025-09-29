const mongoose = require("mongoose");
require("dotenv").config()

const MONGO_URL = process.env.MONGO_URL;

exports.connectDb = async () => {
    try {
        console.log("db's connect")
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB's connected")
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}