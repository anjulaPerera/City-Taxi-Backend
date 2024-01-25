import { NextFunction, Request, Response } from "express";

export namespace RidesEp {
  export async function passengerReservationRide(req: Request, res: Response) {
    console.log("Inside API");
    const reservationData = req.body;
    console.log("Received reservation:", reservationData);

    res.json({
      message: "Location received successfully",
      data: reservationData,
    });
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

  export async function getNearbyDrivers(req: Request, res: Response) {
    // Hardcoded passenger location
    const passengerLocation = { lat: 7.020801, lng: 79.973153 }; //7.020801, 79.973153

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

