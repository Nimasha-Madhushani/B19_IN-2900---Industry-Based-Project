const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
require("dotenv").config();

const dbConnection = require("./src/Config/connectDataBase");

const employeeRouter = require("./src/routes/ReportersManagementModule/employeeRoutes");
const recruitmentRoutes = require("./src/routes/RecruitmentModule/recruitmentRoutes");
const assetRoutes = require("./src/routes/AssetsManagementModule/assetRoutes");
const leaveRoutes = require("./src/routes/LeaveModule/leaveRoutes");

app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 8070;

dbConnection();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});

app.use("/recruitment", recruitmentRoutes);
app.use("/assets", assetRoutes);
app.use("/employee", employeeRouter);
app.use("/leave", leaveRoutes);


