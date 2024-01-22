const passport = require("passport");
import { NextFunction, Request, Response } from "express";
import UserType from "../enums/UserType";

export class Authentication {
  public static verifyToken(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          // AppLogger.error(`Login Failed. reason: ${info}`);
          console.log(`Login Failed. reason: ${info}`);
          return res.sendError(info);
        }

        req.user = user;
        req.body.user = user._id;

        //console.log(req.user);
        return next();
      }
    )(req, res, next);
  }

  //Admin user validation
  public static superAdminUserVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userData: any = req.user;
    if (userData.userType === UserType.ADMIN) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "No authorization to access this route!",
      });
    }
  }

  public static passengerUserVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userData: any = req.user;
    if (
      userData.userType === UserType.PASSENGER ||
      userData.userType === UserType.ADMIN
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "No authorization to access this route!",
      });
    }
  }
  public static driverUserVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userData: any = req.user;
    if (
      userData.userType === UserType.DRIVER ||
      userData.userType === UserType.ADMIN
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "No authorization to access this route!",
      });
    }
  }
}
