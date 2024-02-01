import * as mongoose from "mongoose";
import { Types } from "mongoose";



interface Common {
  passengerId: string;
  driverId?: string;
  stars?: number;
  comment?: string;

}

export interface DFeedback extends Common {
  _id?: Types.ObjectId;
}

export interface IFeedback extends Common, mongoose.Document {}
