import { Express } from "express";
import { UserEp } from "../end-points/user-ep";
import axios from "axios";
import multer from "multer";
import { RidesEp } from "../end-points/rides-ep";

export function initRidesRoutes(app: Express) {
  app.get("/api/public/get/near-drivers", RidesEp.getNearbyDrivers);
  // app.get("/api/auth/get/near-drivers/:userId", RidesEp.getNearbyDrivers);
  app.post("/api/public/current-location", RidesEp.passengerReservationRide);
}
