const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();


const dbConnection = require("./src/Config/connectDataBase");

const userAuthRoutes = require("./src/routes/UserAuthRoutes/UserAuth")
const salaryPaymentRoutes = require("./src/routes/SalaryPaymentModule/salaryPaymentRoutes");
const employeeRouter = require("./src/routes/ReportersManagementModule/employeeRoutes");
const recruitmentRoutes = require("./src/routes/RecruitmentModule/recruitmentRoutes");
const assetRoutes = require("./src/routes/AssetsManagementModule/assetRoutes");
const leaveRoutes = require("./src/routes/LeaveModule/leaveRoutes");
const promotionRoutes = require("./src/routes/PromotionModule/promotionRoutes");


app.use(cors());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 8070;

dbConnection();


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});

app.use("/", userAuthRoutes);
app.use("/recruitment", recruitmentRoutes);
app.use("/salary", salaryPaymentRoutes);
app.use("/assets", assetRoutes);
app.use("/employee", employeeRouter);
app.use("/leave", leaveRoutes);
app.use("/promotion", promotionRoutes);



