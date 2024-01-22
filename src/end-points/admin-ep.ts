import { NextFunction, Request, Response } from "express";
import {
  check,
  param,
  ValidationChain,
  validationResult,
} from "express-validator";
import { DUser } from "../models/user-model";
import { AdminDao } from "../dao/admin-dao";

import { UserDao } from "../dao/user-dao";
import { Validations } from "../common/validation";
import UserType from "../enums/UserType";
import UserStatus from "../enums/UserStatus";
import { Util } from "../common/Util";

export namespace AdminEp {
  export function createAnUserByAdminValidationRules(): ValidationChain[] {
    return [
      check("name")
        .notEmpty()
        .withMessage("name is required")
        .isString()
        .withMessage("name is not a String"),
      Validations.email(),
      check("userType")
        .notEmpty()
        .withMessage("userType is required")
        .isString()
        .withMessage("userType is not a String")
        .isIn([UserType.PASSENGER, UserType.DRIVER])
        .withMessage("userType is not valid type"),
      Validations.password(),
    ];
  }

  // export async function createAnUserByAdmin(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     //input validation
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.sendError(errors.array()[0]["msg"]);
  //     }

  //     //checks if the email already exists in the database
  //     const isCustomerFound = await UserDao.doesUserExist(req.body.email);
  //     if (isCustomerFound) {
  //       return res.sendError("Sorry This Email Already Exists");
  //     }

  //     const name = req.body.name;
  //     const email = req.body.email;
  //     const userType = req.body.userType;
  //     const password = req.body.password;

  //     const userData: DUser = {
  //       name: name,
  //       email: email,
  //       userType: userType,
  //       password: password,

  //     };

  //     //sends an email to user
  //     Util.sendEmail(
  //       email,
  //       "CricView360 Registration Successful!!",
  //       "You have Successfully Registered to CricView360. Your Password : " +
  //         password
  //     ).then(
  //       function (response) {
  //         if (response === 1) {
  //           console.log("Email Sent Successfully!");
  //         } else {
  //           console.log("Failed to Send The Email!");
  //         }
  //       },
  //       function (error) {
  //         console.log("Email Function Failed!");
  //         // return res.sendError("Email Function Failed!");
  //       }
  //     );

  //     //insert member to the database
  //     const saveUser = await AdminDao.registerAnUser(userData);
  //     if (!saveUser) {
  //       return res.sendError("Registration failed");
  //     }

  //   } catch (err) {
  //     return res.sendError(err);
  //   }
  // }

  //block a user by admin validation rules

  export async function getAllUserList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(errors.array()[0]["msg"]);
      }

      const limit = Number(req.params.limit);
      const offset = Number(req.params.offset);

      //get user list
      const userList = await AdminDao.getUsers(limit, offset);
      if (!userList) {
        return res.sendError("Fetching Users Failed");
      }

      res.sendSuccess(userList, "Success!");
    } catch (err) {
      return res.sendError(err);
    }
  }
}
