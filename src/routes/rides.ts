<<<<<<< HEAD

import { Express } from "express";

import { RidesEp } from "../end-points/rides-ep";

export function initRidesRoutes(app: Express) {
  /* PUBLIC ROUTES */
  app.post("/api/public/current-location", RidesEp.passengerReservationRide);
=======
import { Express } from "express";
import { UserEp } from "../end-points/user-ep";
import axios from "axios";
import multer from "multer";



export function initRidesRoutes(app: Express) {
  app.get("/api/auth/get/near-drivers/:userId", UserEp.getNearbyDrivers);

>>>>>>> c36413dc4ebef1885cb5bb9f972a9d49b58e3475
}
