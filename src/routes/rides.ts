import { Express } from "express";
import { UserEp } from "../end-points/user-ep";
import axios from "axios";
import multer from "multer";
import { RidesEp } from "../end-points/rides-ep";

export function initRidesRoutes(app: Express) {
  app.get("/api/get/near-drivers/:userId", UserEp.getNearbyDrivers);

}
