import { NextFunction, Request, Response } from "express";
import {
  check,
  param,
  ValidationChain,
  validationResult,
} from "express-validator";
import { DUser } from "../models/user-model";
import { AdminDao } from "../dao/admin-dao";
import LoginMethod from "../enums/LoginMethod";
import User from "../schemas/user-schema";
import { UserDao } from "../dao/user-dao";
import { Validations } from "../common/validation";
import { Util } from "../common/Util";
import UserStatus from "../enums/UserStatus";
import upload from "../middleware/upload-images";
const { ObjectId } = require("mongodb");

export namespace UserEp {
  export function authenticateWithUserNameValidationRules(): ValidationChain[] {
    return [
      Validations.userName(),
      Validations.password(),
      check("loginMethod")
        .notEmpty()
        .withMessage("loginMethod is required")
        .isString()
        .withMessage("loginMethod is not a String")
        .isIn([LoginMethod.USERNAME])
        .withMessage("loginMethod is not valid type"),
      check("remember")
        .notEmpty()
        .withMessage("remember is required")
        .isString()
        .withMessage("remember is not a String")
        .isIn(["TRUE", "FALSE"])
        .withMessage("remember is not valid type"),
    ];
  }
  // export function authenticateWithEmailValidationRules(): ValidationChain[] {
  //   return [
  //     Validations.email(),
  //     Validations.password(),
  //     check("loginMethod")
  //       .notEmpty()
  //       .withMessage("loginMethod is required")
  //       .isString()
  //       .withMessage("loginMethod is not a String")
  //       .isIn([LoginMethod.EMAIL])
  //       .withMessage("loginMethod is not valid type"),
  //     check("remember")
  //       .notEmpty()
  //       .withMessage("remember is required")
  //       .isString()
  //       .withMessage("remember is not a String")
  //       .isIn(["TRUE", "FALSE"])
  //       .withMessage("remember is not valid type"),
  //   ];
  // }
  // export function signUpWithEmailValidationRules(): ValidationChain[] {
  //   return [Validations.email(), Validations.password()];
  // }

  export function signUpWithEmailValidationRules(): ValidationChain[] {
    return [
      check("email")
        .notEmpty()
        .withMessage("Email is required!!")
        .isString()
        .withMessage("email is not a String"),
      Validations.password(),
    ];
  }

  // export async function authenticateWithEmail(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const errors = validationResult(req);

  //     if (!errors.isEmpty()) {
  //       return res.sendError(errors.array()[0]["msg"]);
  //     }

  //     const email = req.body.email;
  //     const password = req.body.password;
  //     const loginMethod = req.body.loginMethod;
  //     const remember = !!req.body.remember;

  //     if (loginMethod == LoginMethod.EMAIL) {
  //       let user: any = await User.findOne({ email: email });
  //       if (!user) {
  //         return res.sendError("User Not Found in the System");
  //       }

  //       UserDao.loginWithEmail(email, password, loginMethod, remember, user)
  //         .then((token: string) => {
  //           res.cookie("token", token, {
  //             httpOnly: true,
  //             secure: false,
  //             maxAge: 3600000 * 24 * 30,
  //           });

  //           res.sendSuccess(token, "Successfully Logged In645!");
  //         })
  //         .catch(next);
  //     } else {
  //       return res.sendError("Not A Valid login Method");
  //     }
  //   } catch (err) {
  //     return res.sendError(err);
  //   }
  // }
  export async function authenticateWithUserName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(errors.array()[0]["msg"]);
      }

      const userName = req.body.userName;
      const password = req.body.password;
      const loginMethod = req.body.loginMethod;
      const remember = !!req.body.remember;

      if (loginMethod == LoginMethod.USERNAME) {
        let user: any = await User.findOne({ userName: userName });
        if (!user) {
          return res.sendError("User Not Found in the System");
        }

        UserDao.loginWithUserName(
          userName,
          password,
          loginMethod,
          remember,
          user
        )
          .then((token: string) => {
            res.cookie("token", token, {
              httpOnly: true,
              secure: false,
              maxAge: 3600000 * 24 * 30,
            });

            res.sendSuccess(token, "Successfully Logged In!");
          })
          .catch(next);
      } else {
        return res.sendError("Not A Valid login Method");
      }
    } catch (err) {
      return res.sendError(err);
    }
  }

  export async function getUserDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.sendSuccess(req.user, "User Found!");
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }

  export async function getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.params.userId;

      const user = await UserDao.getUserById(userId);

      if (!user) {
        return res.sendError("User Not Found");
      }

      res.sendSuccess(user, "User Found!");
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }

  export function resetPasswordValidationRules(): ValidationChain[] {
    return [
      check("currentPassword")
        .notEmpty()
        .withMessage("current Password is required")
        .isString()
        .withMessage("current Password is not a String"),
      Validations.newPassword(),
    ];
  }

  export async function resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.sendError(errors.array()[0]["msg"]);
      }

      const currentPassword = req.body.currentPassword;
      const newPassword = req.body.newPassword;

      const userData: any = req.user;

      const isMatch = await userData.comparePassword(currentPassword);
      if (!isMatch) {
        return res.sendError("Pervious password is incorrect!!");
      } else {
        const hashing = await Util.passwordHashing(newPassword);

        const updatePassword = await UserDao.updateToANewPassword(
          userData,
          hashing
        );

        if (!updatePassword) {
          return res.sendError(
            "Something Went Wrong. Could not update the password"
          );
        }
        res.sendSuccess("Password Reset Successful!!", "Success!");
      }
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }

  export async function signUpUser(
    req: Request & { file: any },
    res: Response,
    next: NextFunction
  ) {
    try {
      const isCustomerFound = await UserDao.doesUserExist(req.body.email);
      if (isCustomerFound) {
        return res.sendError("Sorry, this email already exists");
      }
      const name = req.body.name;
      const phone = req.body.phone;
      const userType = req.body.userType;

      const email = req.body.email;

      function getRandomDigits(length: number): string {
        const randomDigits = Math.floor(Math.random() * Math.pow(10, length));
        return randomDigits.toString().padStart(length, "0");
      }

      function generateRandomUserName(name: string, phone: string): string {
        const lastFourDigits = phone.slice(-4);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${
          currentDate.getMonth() + 1
        }`;

        return `${name}${lastFourDigits}${formattedDate}`;
      }

      const userName: string = generateRandomUserName(name, phone);
      console.log(userName);
      function generateRandomPassword(): string {
        const timestamp = new Date().getTime().toString();
        const length = 12;

        const alphaCharacters =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        let password = timestamp.slice(-length + 2);
        for (let i = 0; i < 2; i++) {
          const randomAlphaIndex = Math.floor(
            Math.random() * alphaCharacters.length
          );
          password += alphaCharacters.charAt(randomAlphaIndex);
        }

        return password;
      }

      const password: string = generateRandomPassword();
      console.log(password);

      const userData: DUser = {
        name: name,
        email: email,
        userType: userType,
        phone: phone,
        userName: userName,
        password: password,
      };

      console.log("userData===>", userData);

      const saveUser = await UserDao.registerAnUser(userData);

      if (!saveUser) {
        return res.sendError("Registration failed");
      }

      Util.sendVerificationEmail(email, userName, password).then(
        function (response) {
          if (response === 1) {
            console.log("Email Sent Successfully!");
          } else {
            console.log("Failed to Send The Email!");
          }
        },
        function (error) {
          console.log("Email Function Failed!");
        }
      );

      console.log("saveUser", saveUser);
      return res.sendSuccess(saveUser, "User Registered!");
      // }
      // );
    } catch (err) {
      return res.sendError(err);
    }
  }


}

