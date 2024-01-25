import * as mongoose from "mongoose";
import { Schema, Types } from "mongoose";
import UserType from "./../enums/UserType";

interface Common {
  name?: string;
  userName?: string;
  userType?: string;
  password?: string;
  phone?: number;
  email?: string;
  driverLocation?: {
    type: string;
    coordinates: {
      long: number;
      lat: number;
    };
  
  }
}

export interface DUser extends Common {
  _id?: Types.ObjectId;
}

export interface IUser extends Common, mongoose.Document {
  createAccessToken(expiresIn?: string): string;
  comparePassword(password: string): Promise<boolean>;
}