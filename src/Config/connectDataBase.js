const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const URL = process.env.MONGODB_URL;

const dbConnection = () => {
    mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch((error) => {
        console.log({ error: error.message });
        console.log("MongoDB connection failed");
    });
    const connection = mongoose.connection;
    connection.once("open", () => {
        console.log("MongoDB connection is success!");
    })
};

module.exports = dbConnection;