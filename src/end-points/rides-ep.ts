import { NextFunction, Request, Response } from "express";
import { RidesDao } from "../dao/rides-dao";
import { DRegRides } from "../models/reg-rides-model";
import { IUser } from "../models/user-model";

export namespace RidesEp {
  let reservationData: any;
  export async function passengerReservationRide(req: Request, res: Response) {
    try {
      const user = req.user as IUser;

      if (!user || !user._id) {
        return res.status(400).json({ message: "Invalid user object" });
      }


      const reservationData: DRegRides = {
        from: req.body.pickup,
        to: req.body.dropoff,
        vehicleType: req.body.selectedVehicle,
        passengerId: user._id.toString(),
        time: new Date(),
      };

      const reservation = await RidesDao.saveReservation(reservationData);
      if (!reservation) {
        return res.sendError("Failed to save post");
      }

      console.log("reservation (0_0)", reservation);
      return res.sendSuccess(reservation, "Post Saved Successfully!");
    } catch (error) {
      console.log("catch error", error);
    }
  }

  class LocationManager {
    savePassengerLocation(location: { lat: number; lng: number }): void {
      // Implement the logic to save passenger location
      console.log("Passenger location saved:", location);
    }

    getNearbyDrivers(
      driverLocations: Record<string, { lat: number; lng: number }>
    ): string[] {
      // Implement the logic to calculate nearby drivers
      console.log("Calculating nearby drivers...");
      const nearbyDrivers: string[] = [];

      for (const driverId in driverLocations) {
        const driverLocation = driverLocations[driverId];
        nearbyDrivers.push(driverId);
      }

      return nearbyDrivers;
    }
  }

  export async function getDriversInside3Km(req: Request, res: Response) {
    console.log("pickup lat:", reservationData.pickup.coordinates.lat);
    console.log("pickup lng:", reservationData.pickup.coordinates.lng);

    const passengerLocation = {
      lat: reservationData.pickup.coordinates.lat,
      lng: reservationData.pickup.coordinates.lng,
    };

    console.log("Passenger location::::", passengerLocation);

    // Create an instance of PassengerLocationManager
    const locationManager = new LocationManager();
    locationManager.savePassengerLocation(passengerLocation);

    const drivers = {};

    // Hardcoded driver locations
    const driverLocations: Record<string, { lat: number; lng: number }> = {
      driver1: { lat: 7.019214, lng: 79.97732 }, //7.019214, 79.977320
      driver2: { lat: 6.987857, lng: 80.001625 }, //6.987857, 80.001625
    };

    // Calculate nearby drivers
    const nearbyDrivers = locationManager.getNearbyDrivers(driverLocations);

    res.json({ nearbyDrivers });
  }
}
