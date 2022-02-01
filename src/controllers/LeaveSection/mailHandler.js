const nodemailer = require("nodemailer");
const googleapis = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new googleapis.google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmails = async (
  employee,
  newLeave,
  teamLeader,
  teamLeaderBoolean
) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "yours authorized email address",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: teamLeaderBoolean
        ? teamLeader.employeeFirstName
        : employee.employeeFirstName + "<" + teamLeaderBoolean
        ? teamLeader.companyEmail
        : employee.companyEmail + ">",
      to: teamLeaderBoolean ? employee.companyEmail : teamLeader.companyEmail,
      subject: "request a" + newLeave.leaveType + "leave",
      text: newLeave.reason,
      html: "<h1>your email</h1>",
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = sendEmails;
