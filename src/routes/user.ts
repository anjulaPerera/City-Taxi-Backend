import { Express } from "express";
import { UserEp } from "../end-points/user-ep";

export function initUserRoutes(app: Express) {
  /* PUBLIC ROUTES */
  app.post(
    "/api/public/login",
    UserEp.authenticateWithUserNameValidationRules(),
    UserEp.authenticateWithUserName
  );
  app.post("/api/public/signup", UserEp.signUpUser);
  // app.get("/api/public/verify-email", UserEp.verifyEmail);

  /* AUTH ROUTES */
  app.get("/api/auth/get/user", UserEp.getUserDetails);
  app.get("/api/auth/get/user/:userId", UserEp.getUserById);

  app.post(
    "/api/auth/reset/password",
    UserEp.resetPasswordValidationRules(),
    UserEp.resetPassword
  );

  app.post("/api/auth/driver/available/:userId", UserEp.makeDriverAvailable);
  app.post("/api/auth/driver/busy/:userId", UserEp.makeDriverBusy);
}
