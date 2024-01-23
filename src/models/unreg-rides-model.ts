import * as mongoose from "mongoose";
import { Types } from "mongoose";

interface Common {
  passengerName: string;
  passengerPhone: string;
  driverId: Types.ObjectId;
  from: string;
  to: string;
  date: Date;
  time: string;
  price?: number;
  vehicleType: string;
}

export interface DUnRegRides extends Common {
  _id?: Types.ObjectId;
}

export interface IUnRegRides extends Common, mongoose.Document {}
