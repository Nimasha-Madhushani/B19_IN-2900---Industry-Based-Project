const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
require("dotenv").config();


const dbConnection = require("./src/Config/connectDataBase");


const recruitmentRoutes = require("./src/routes/RecruitmentModule/recruitmentRoutes");
const assetRoutes = require("./src/routes/AssetsManagementModule/assetRoutes");
const salaryPaymentRoutes = require("./src/routes/SalaryPaymentModule/salaryPaymentRoutes");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 8070;

dbConnection();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});


app.use("/recruitment", recruitmentRoutes);
app.use("/assets", assetRoutes);
app.use("/salary", salaryPaymentRoutes);




