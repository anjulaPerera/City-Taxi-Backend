import UserType from "../enums/UserType";
import { DFeedback, IFeedback } from "../models/feedbacks";
import { DRegRides, IRegRides } from "../models/reg-rides-model";
import { IUser } from "../models/user-model";
import Feedbacks from "../schemas/Feedbacks-schema";
import RegRides from "../schemas/RegRides-schema";
import User from "../schemas/user-schema";

export namespace RidesDao {
  export async function saveReservation(
    reservationData: DRegRides
  ): Promise<IRegRides | null> {
    try {
      const saveReservation = await RegRides.create(reservationData);
      return saveReservation;
    } catch (error) {
      throw error;
    }
  }
  export async function getAllDrivers(): Promise<IUser[]> {
    return await User.find({ userType: UserType.DRIVER }).exec();
  }
  //find a ride by user id
  export async function getAllRidesByPassengerId(
    userId: any
  ): Promise<IRegRides | null> {
    return await RegRides.find({ passengerId: userId });
  }
  export async function saveFeedback(
    feedBackData: DFeedback
  ): Promise<IFeedback | null> {
    try {
      const saveFeedback = await Feedbacks.create(feedBackData);
      return saveFeedback;
    } catch (error) {
      throw error;
    }
  }
}
