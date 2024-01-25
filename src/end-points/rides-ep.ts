import { NextFunction, Request, Response } from "express";
import { RidesDao } from "../dao/rides-dao";
import { DRegRides } from "../models/reg-rides-model";

export namespace RidesEp {
  let reservationData: any;
  export async function passengerReservationRide(req: Request, res: Response) {
    const user = req.user;
    console.log("user:=======>", user);
    console.log("user._id", user._id);
    
    const currentDate = new Date();

    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentTime =
      currentHours + ":" + (currentMinutes < 10 ? "0" : "") + currentMinutes;

    const reservationData: DRegRides = {
      from: req.body.pickup,
      to: req.body.dropoff,
      vehicleType: req.body.selectedVehicle,
      passengerId: user._id.toString(), // Assuming user.id is the passengerId
      date: new Date(), // Add the date from the request
      time: currentTime,
    };


    const reservation = await RidesDao.saveReservation(reservationData);

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
