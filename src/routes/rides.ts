import { Express } from "express";
import { RidesEp } from "../end-points/rides-ep";

export function initRidesRoutes(app: Express) {
  // app.get("/api/public/get/near-drivers/:userId", RidesEp.getNearbyDrivers);
  // app.post("/api/auth/post/reservation", RidesEp.passengerReservationRide);
  app.post("/api/public/post/reservation", RidesEp.passengerReservationRide);
  app.get("/api/public/get/nearby-drivers", RidesEp.getNearbyDrivers);
}
