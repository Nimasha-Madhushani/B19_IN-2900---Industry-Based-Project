const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.PASSWORD;
const sendEmails = async (savedSensitiveDetail, savedEmployee) => {
  try {
    const emailTemplateCredentials= fs.readFileSync(
      path.join(__dirname, "/SendCredentials.handlebars"),
      "utf8"
    );

    const templeteCredentialsAttachment = handlebars.compile(
      emailTemplateCredentials
    );

    const htmlToSentCredentials = templeteCredentialsAttachment({
      userName: savedSensitiveDetail.userName,
      password: savedEmployee.NIC,
      employeeName:
        savedEmployee.employeeFirstName + " " + savedEmployee.employeeLastName,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: APP_PASSWORD,
      },
    });

    const mailOptions = {
      to: savedEmployee.companyEmail,

      // text: data.reason,
      html: htmlToSentCredentials,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = sendEmails;
