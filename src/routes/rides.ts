import { Express } from "express";
import { RidesEp } from "../end-points/rides-ep";

export function initRidesRoutes(app: Express) {
  // app.get("/api/public/get/near-drivers/:userId", RidesEp.getNearbyDrivers);
  app.post("/api/auth/post/reservation", RidesEp.passengerReservationRide);
  // app.post("/api/public/post/reservation", RidesEp.passengerReservationRide);
  app.get("/api/public/get/all-drivers", RidesEp.getAllDrivers);
  app.post("/api/public/update-location", RidesEp.updateLocation);
  app.get(
    "/api/public/get/nearby-drivers/:userId",
    RidesEp.getDriversInside3Km
  );
  app.post("/api/auth/post/feedback/:driverId/:userId", RidesEp.addFeedback);
  app.post("/api/auth/send/reservation-data/to-driver/:passengerId/:driverId", RidesEp.sendReservationDataToDriver);
}
