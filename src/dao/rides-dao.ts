import { DRegRides, IRegRides } from "../models/reg-rides-model";
import RegRides from "../schemas/RegRides-schema";

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
}
