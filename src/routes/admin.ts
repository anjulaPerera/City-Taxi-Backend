import { Express } from "express";
import { AdminEp } from "../end-points/admin-ep";
import { Authentication } from "../middleware/authentication";
import { Util } from "../common/Util";

export function initAdminRoutes(app: Express) {
  /* PUBLIC ROUTES */

  /* AUTH ROUTES */
  // app.post(
  //   "/api/auth/create/user",
  //   Authentication.superAdminUserVerification,
  //   AdminEp.createAnUserByAdminValidationRules(),
  //   AdminEp.createAnUserByAdmin
  // );

  app.get(
    "/api/auth/get/user-list/:limit/:offset",
    Authentication.superAdminUserVerification,
    Util.limitOffsetValidationRules(),
    AdminEp.getAllUserList
  );
}
