import { Express } from "express";
import { UserEp } from "../end-points/user-ep";
import axios from "axios";
import multer from "multer";



export function initRidesRoutes(app: Express) {
  app.get("/api/auth/get/near-drivers/:userId", UserEp.getNearbyDrivers);

}
