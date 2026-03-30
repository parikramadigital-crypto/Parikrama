import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function SendMail(
  receivers,
  subject = "",
  text = "",
  html_templateName,
  replacements,
) {
  // async..await is not allowed in global scope, must use a wrapper
  async function main(
    receivers,
    subject = "",
    text = "",
    html_templateName,
    replacements,
  ) {
    // Read the HTML template
    const templatePath = path.join(
      __dirname,
      "./Email_Templates",
      html_templateName,
    );
    let emailHtml = fs.readFileSync(templatePath, "utf8");

    // Replace dynamic values in the template
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g"); // Replace all occurrences
      emailHtml = emailHtml.replace(regex, replacements[key]);
    });

    //*****************the below transporter is for using in gmail******************//
    // send mail with defined transport object
    // const transporter = nodemailer.createTransport({
    //   //  host: "smtp.ethereal.email",
    //   service: process.env.EMAIL_SERVICE,
    //   port: 465,
    //   secure: true, // true for port 465, false for other ports
    //   auth: {
    //     user: process.env.SENDER_EMAIL, // generated ethereal user
    //     pass: process.env.SENDER_APP_PASSWORD, // generated ethereal password
    //   },
    // });
    //*****************the above transporter is for using in gmail******************//

    //for hostinger
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // smtp.hostinger.com
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Parikrama" <${process.env.SENDER_EMAIL}>`, // sender address
      to: receivers, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: emailHtml, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    return info;
  }

  const MailDetails = main(
    receivers,
    subject,
    text,
    html_templateName,
    replacements,
  ).catch(console.error);

  return MailDetails;
}

export default SendMail;
