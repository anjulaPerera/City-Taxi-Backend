import * as bcrypt from "bcryptjs";
import { ValidationChain, param } from "express-validator";
const nodemailer = require("nodemailer");
import crypto from "crypto";
require("dotenv").config();

export namespace Util {
  export function limitOffsetValidationRules(): ValidationChain[] {
    return [
      param("limit")
        .exists()
        .withMessage("limit is required")
        .isInt({ min: 1 })
        .withMessage("limit is not a valid integer"),
      param("offset")
        .exists()
        .withMessage("offset is required")
        .isInt({ min: 1 })
        .withMessage("offset is not a valid integer"),
    ];
  }
  export async function passwordHashing(password: string): Promise<any> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  //sends email
  // export async function sendEmail(
  //   email: string,
  //   subject: string,
  //   text: string,
  //   html?: string
  // ) {
  //   try {
  //     let transporter = nodemailer.createTransport({
  //       host: process.env.EMAIL_HOST,
  //       port: process.env.EMAIL_PORT,
  //       secure: false, // true for 465, false for other ports
  //       auth: {
  //         user: process.env.EMAIL_USER, // generated ethereal user
  //         pass: process.env.EMAIL_PASS, // generated ethereal password
  //       },
  //     });

  //     // send mail with defined transport object
  //     let info = await transporter.sendMail({
  //       from: process.env.COMPANY_EMAIL, // sender address
  //       to: email, // list of receivers
  //       subject: subject, // Subject line
  //       text: text, // plain text body
  //       // html: html, // html body
  //     });

  //     return 1;
  //   } catch (err) {
  //     console.log(err);
  //     return 0;
  //   }
  // }

  export async function sendVerificationEmail(
    email: string,
    userName: string,
    password: string
  ): Promise<number> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const htmlBody = `
  <table width="500" height="400" cellpadding="0" cellspacing="0" style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); background-color:transparent; border-radius:8px;">
    <tr>
      <td colspan="2" style="background-color:#08273e; border-radius:8px 8px 0 0; text-align:center; color:white; height:70px;">
        <h2>Email Verification</h2>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="text-align:center;">
        <h4>Your Login Credentials!</h4>
        <p style="font-size: 14px;">User Name : ${userName}</p>
        <p style="font-size: 14px;">Password : ${password}</p>

         <p style="font-size: 10px;">*Use these login credentials to login to your account</p>
      </td>
    </tr>
  
    <tr>
      <td colspan="2" style="background-color: #08273e; border-radius:0 0 8px 8px; text-align:start; color:white; height:70px;">
        <p style="margin-left:20px;">&copy; ${new Date().getFullYear()} City Taxi |  All rights reserved</p>
      </td>
    </tr>
  </table>
`;

      let info = await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: "City taxi account credentials",
        html: htmlBody,
      });

      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  // export async function sendPasswordResetEmail(
  //   email: string,
  //   token: string
  // ): Promise<number> {
  //   try {
  //     const transporter = nodemailer.createTransport({
  //       host: process.env.MAIL_HOST,
  //       port: process.env.MAIL_PORT,
  //       secure: false,
  //       auth: {
  //         user: process.env.MAIL_USERNAME,
  //         pass: process.env.MAIL_PASSWORD,
  //       },
  //     });

  //     const htmlBody = ``
  //   } catch (err) {}}
}
