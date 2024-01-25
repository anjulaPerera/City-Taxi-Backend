import * as mongoose from "mongoose";
import { Types } from "mongoose";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Common {
  passengerId: string;
  driverId?: string;
  from: {
    address: string;
    coordinates: Coordinates;
  };
  to: {
    address: string;
    coordinates: Coordinates;
  };
  time: Date;
  price?: number;
  vehicleType?: string;
}

export interface DRegRides extends Common {
  _id?: Types.ObjectId;
}

export interface IRegRides extends Common, mongoose.Document {}
