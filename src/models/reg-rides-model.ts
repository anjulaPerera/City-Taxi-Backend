import * as mongoose from "mongoose";
import { Types } from "mongoose";

interface Common {
  passengerId: string;
  driverId?: string;
  from: string;
  to: string;
  time: Date;
  price?: number;
  vehicleType?: string;
}

export interface DRegRides extends Common {
  _id?: Types.ObjectId;
}

export interface IRegRides extends Common, mongoose.Document {}
