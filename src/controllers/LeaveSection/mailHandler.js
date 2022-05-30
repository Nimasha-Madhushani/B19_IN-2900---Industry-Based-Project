const nodemailer = require("nodemailer");
const googleapis = require("googleapis");


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const USER = process.env.USER;

const oAuth2Client = new googleapis.google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmails = async (
  employee,
  data,
  teamLeader,
  condition
) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    
    const mailOptions = {
      to: condition.teamLeaderBoolean ? employee.companyEmail : teamLeader.companyEmail,
      subject: condition.teamLeaderBoolean ? condition.task: condition.task + " "+data.leaveType+ " " + "leave",
      text: data.reason,
      html: "<h2>request a leave</h2>",
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = sendEmails;
