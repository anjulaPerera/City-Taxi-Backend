import { NextFunction, Request, Response } from "express";
import { RidesDao } from "../dao/rides-dao";
import { DRegRides } from "../models/reg-rides-model";
import { IUser } from "../models/user-model";
import User from "../schemas/user-schema";
import { UserDao } from "../dao/user-dao";

export namespace RidesEp {
  let reservationData: any;
  export async function passengerReservationRide(req: Request, res: Response) {
    console.log("passengerReservationRide called...");
    try {
      const user = req.user as IUser;
      console.log("USER:::", user);

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

  export async function getAllDrivers(req: Request, res: Response) {
    console.log("getAllDrivers called...");
    try {
      const drivers = await RidesDao.getAllDrivers();

      res.sendSuccess(drivers, "Post Saved Successfully!");
      console.log("drivers", drivers);
    } catch (error) {
      console.log("catch error", error);
    }
  }

  export async function updateLocation(req: Request, res: Response) {
    console.log("updateLocation called...");
    const { driverId } = req.body;

    try {
      const user = await User.findById(driverId);

      // Check if the user exists and has the userType set to "DRIVER"
      if (user && user.userType === "DRIVER") {
        const { coords } = req.body; // Extract the coordinates from the request body

        const updatedDrivers = await User.findByIdAndUpdate(driverId, {
          driverLocation: {
            type: "Point",
            coordinates: { long: coords.longitude, lat: coords.latitude }, // Note the order: [lng, lat]
          },
        });

        res.sendSuccess(
          updatedDrivers,
          "Locations of Drivers updated successfully"
        );
      } else {
        res
          .status(404)
          .json({ message: "Driver not found or not of type DRIVER" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  export async function getDriversInside3Km(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      let allRidesByUser = (await RidesDao.getAllRidesByPassengerId(
        userId
      )) as any;
      console.log("ALL RIDES BY USER", allRidesByUser);

      //Sort rides by createdAt field in descending order
      allRidesByUser.sort(
        (
          a: { createdAt: { getTime: () => number } },
          b: { createdAt: { getTime: () => number } }
        ) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      // Get the latest record
      const latestRide = allRidesByUser[0];
      const passengerLocation = latestRide.from.coordinates;
      console.log("LATEST RIDE", latestRide);
      console.log("PASSENGER LOCATION", passengerLocation);

      const drivers = await RidesDao.getAllDrivers();
      // Declare the distance variable
      let distance: number;
      console.log("ALL DRIVERS", drivers);
      const driversInside3Km = drivers.filter((driver) => {
        distance = getDriversInside3Km(
          passengerLocation.lat,
          passengerLocation.lng,
          driver.driverLocation.coordinates.lat,
          driver.driverLocation.coordinates.long
        );
        console.log("DISTANCE for", driver.name, distance);
        const minimumDistance: number = parseFloat(
          process.env.PASSENGER_TO_DRIVER
        );
        console.log("MINIMUM DISTANCE", minimumDistance);
        console.log("type of minimum distance", typeof minimumDistance);

        return distance <= minimumDistance;
      });

      const nearByDrivers = { driversInside3Km, distanceToPassenger: distance };

      console.log("DRIVERS INSIDE 3KM", nearByDrivers);

      res.sendSuccess(nearByDrivers, "Drivers inside 3km");
    } catch (error) {}

    function deg2rad(deg: number): number {
      return deg * (Math.PI / 180);
    }
    function getDriversInside3Km(
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ): number {
      const R = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
  }
}
