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

export namespace RidesEp {

  export async function passengerReservationRide(req: Request, res: Response) {
    (req, res) => {
      const reservationData = req.body;
      console.log("Received reservation:", reservationData);

      res.json({
        message: "Location received successfully",
        data: reservationData,
      });
    };
  }


}
