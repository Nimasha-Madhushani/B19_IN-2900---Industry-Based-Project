const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.PASSWORD;

const sendEmails = async (employee, data, teamLeader, condition) => {
  try {
    const emailTemplateSourceRequest = fs.readFileSync(
      path.join(__dirname, "/main.handlebars"),
      "utf8"
    );
    const emailTemplateSourceCancel = fs.readFileSync(
      path.join(__dirname, "/cancel.handlebars"),
      "utf8"
    );

    const emailTemplateSourceApprove = fs.readFileSync(
      path.join(__dirname, "/approve.handlebars"),
      "utf8"
    );

    const emailTemplateSourceReject = fs.readFileSync(
      path.join(__dirname, "/reject.handlebars"),
      "utf8"
    );

    const templateRequest = handlebars.compile(emailTemplateSourceRequest);
    const templateCancel = handlebars.compile(emailTemplateSourceCancel);
    const templateApprove = handlebars.compile(emailTemplateSourceApprove);
    const templateReject = handlebars.compile(emailTemplateSourceReject);

    const htmlToSendRequest = templateRequest({
      reason: data.reason,
      employeePhoneNumber:employee.phoneNumber,
      employeeEmail:employee.companyEmail,
      employeeID:employee.employeeID,
      employeeName: employee.employeeFirstName+" "+employee.employeeLastName,
      task: condition.task,
      leaveType: data.leaveType,
      teamLeader: teamLeader.employeeFirstName,
    });
    const htmlToSendCancel = templateCancel({
      reason: data.reason,
      employeeID:employee.employeeID,
      employeeName: employee.employeeFirstName+" "+employee.employeeLastName,
      task: condition.task,
      leaveType: data.leaveType,
      startDate: new Date(data.leaveStartDate).toDateString(),
      appliedReason: data.prevReason, 
      endDate: new Date(data.leaveEndDate).toDateString(),
      teamLeader: teamLeader.employeeFirstName,
    });
    const htmlToSendApprove = templateApprove({
      employee: employee.employeeFirstName,
      task: condition.task,
      leaveType: data.leaveType,
      startDate: new Date(data.startDate).toDateString(),
      endDate: new Date(data.endDate).toDateString(),
      teamLeaderID: teamLeader.employeeID,
      teamLeaderName: teamLeader.employeeFirstName+" "+teamLeader.employeeLastName, 
    });
    const htmlToSendReject = templateReject({
      reason: data.reason,
      employee: employee.employeeFirstName,
      task: condition.task,
      leaveType: data.leaveType,
      startDate: new Date(data.startDate).toDateString(),
      endDate: new Date(data.endDate).toDateString(), 
      teamLeaderID: teamLeader.employeeID,
      teamLeaderName: teamLeader.employeeFirstName+" "+teamLeader.employeeLastName,
    });
   
    const transporter = nodemailer.createTransport({ 
      service: "gmail", 
      auth: {
        user: EMAIL, 
        pass: APP_PASSWORD, 
      },
    });

    

    const mailOptions = {
      to: condition.teamLeaderBoolean
        ? employee.companyEmail
        : teamLeader.companyEmail,
      subject: condition.teamLeaderBoolean
        ? condition.task
        : condition.task + " " + data.leaveType + " " + "leave",

      text: data.reason,

      html:
        condition.task == "request"
          ? htmlToSendRequest
          : condition.task == "cancel"
          ? htmlToSendCancel
          : condition.task == "Approved"
          ? htmlToSendApprove
          : htmlToSendReject,
      
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = sendEmails;
