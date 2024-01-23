
import { Express } from "express";

import { RidesEp } from "../end-points/rides-ep";

export function initRidesRoutes(app: Express) {
  /* PUBLIC ROUTES */
  app.post("/api/public/current-location", RidesEp.passengerReservationRide);
}
