import { DRegRides, IRegRides } from "../models/reg-rides-model";
import RegRides from "../schemas/RegRides-schema";

export namespace RidesDao {
  //save ride details to the ride collection
  // passenger pickup location
  // passenger drop location
  // passenger id
  // pickup time

  export async function saveReservation(
    reservationData: DRegRides
  ): Promise<IRegRides | null> {
    try {
      const savedPost = await RegRides.create(reservationData);
      return savedPost;
    } catch (error) {
      throw error;
    }
  }
}
