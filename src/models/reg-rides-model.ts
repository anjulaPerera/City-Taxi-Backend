import * as mongoose from "mongoose";
import { Types } from "mongoose";

interface Common {
  passengerId: Types.ObjectId;
  driverId: Types.ObjectId;
  from: string;
  to: string;
  date: Date;
  time: string;
  price?: number;
  vehicleType: string;
}

export interface DRegRides extends Common {
  _id?: Types.ObjectId;
}

export interface IRegRides extends Common, mongoose.Document {}
