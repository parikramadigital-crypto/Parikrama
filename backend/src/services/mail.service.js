import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendMailService = async ({
  receivers,
  subject,
  text,
  html_templateName,
  replacements = {},
}) => {
  const templatePath = path.join(
    __dirname,
    "../utils/template/mail",
    html_templateName,
  );

  let emailHtml = fs.readFileSync(templatePath, "utf8");

  Object.keys(replacements).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    emailHtml = emailHtml.replace(regex, replacements[key]);
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  return await transporter.sendMail({
    from: `"Parikrama" <${process.env.SENDER_EMAIL}>`,
    to: receivers,
    subject,
    text,
    html: emailHtml,
  });
};
