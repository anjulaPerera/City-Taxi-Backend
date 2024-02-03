import { NextFunction, Request, Response } from "express";
import { RidesDao } from "../dao/rides-dao";
import { DRegRides } from "../models/reg-rides-model";
import { IUser } from "../models/user-model";
import User from "../schemas/user-schema";
import { UserDao } from "../dao/user-dao";
import VehicleType from "../enums/VehicleType";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

export namespace RidesEp {
  export async function passengerReservationRide(req: Request, res: Response) {
    console.log("passengerReservationRide called...");
    try {
      const user = req.user as IUser;
      console.log("USER:::", user);

      if (!user || !user._id) {
        return res.status(400).json({ message: "Invalid user object" });
      }

      function deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
      }

      function calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
      ): number {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers

        return distance;
      }

      const reservationData: DRegRides = {
        from: req.body.pickup,
        to: req.body.dropoff,
        vehicleType: req.body.selectedVehicle,
        passengerId: user._id.toString(),
        time: new Date(),
      };

      const distanceOfRide = calculateDistance(
        reservationData.from.coordinates.lat,
        reservationData.from.coordinates.lng,
        reservationData.to.coordinates.lat,
        reservationData.to.coordinates.lng
      );
      if (isNaN(distanceOfRide)) {
        console.log("Invalid distance value");
        return res.sendError("Invalid distance value");
      }

      let price = 0;

      if (reservationData.vehicleType === VehicleType.TUK) {
        console.log("TUK");
        price = distanceOfRide * parseFloat(process.env.TUK_RATE_PER_KM);
      } else if (reservationData.vehicleType === VehicleType.CAR) {
        console.log("CAR");
        price = distanceOfRide * parseFloat(process.env.CAR_RATE_PER_KM);
        console.log("price", price);
      } else if (reservationData.vehicleType === VehicleType.VAN) {
        console.log("VAN");
        price = distanceOfRide * parseFloat(process.env.VAN_RATE_PER_KM);
      } else {
        console.log("Incorrect vehicle type");
      }

      if (isNaN(price)) {
        console.log("Invalid price value");
        return res.sendError("Invalid price value");
      }

      const formattedPrice = price.toFixed(2);
      reservationData.price = parseFloat(formattedPrice);
      console.log("price---------------------", price);

      console.log("distance of ride", distanceOfRide);

      console.log("reservationData======================>>>", reservationData);

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
      console.log("PASSENGER LOCATION===>", passengerLocation);
      console.log("LATEST RIDE", latestRide);

      const drivers = await RidesDao.getAllDrivers();
      // Declare the distance variable
      let distance: number;
      console.log("ALL DRIVERS", drivers);
      const driversInside3Km = drivers.filter((driver) => {
        //THIS SHOULD GET DRIVER'S CURRENT LOCATION - I WILL USE PASSENGERS PICKUP LOCATION FOR DRIVER LOCARTIONS FOR NOW_______________________________________________________________________________________________________________________________________________________________________________________________________________
        driver.driverLocation.coordinates.lat = passengerLocation.lat;
        driver.driverLocation.coordinates.long = passengerLocation.lng;

        console.log(
          "getDriversInside3Km DATA - driver.driverLocation.coordinates.lat===>",
          driver.driverLocation.coordinates.lat
        );
        console.log(
          "getDriversInside3Km DATA - driver.driverLocation.coordinates.long===>",
          driver.driverLocation.coordinates.long
        );

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

      console.log(
        "DRIVERS INSIDE 3KM==========================",
        driversInside3Km
      );

      const availableDrivers = driversInside3Km.filter(
        (driver) => driver.availabilityOfDriver === "AVAILABLE"
      );

      const nearByDrivers = { availableDrivers, distanceToPassenger: distance };

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

  export async function addFeedback(req: Request, res: Response) {
    console.log("addFeedback called...");
    try {
      const driverId = req.params.driverId;
      const userId = req.params.userId;
      const { stars, comment } = req.body;

      const driver = await UserDao.getUserById(driverId);
      const passenger = await UserDao.getUserById(userId);

      if (!driver || !passenger) {
        return res.sendError("Driver or passenger not found");
      }

      const feedback = {
        stars,
        comment,
        passengerId: userId,
        driverId,
      };

      const savedFeedback = await RidesDao.saveFeedback(feedback);

      if (!savedFeedback) {
        return res.sendError("Failed to save feedback");
      }

      return res.sendSuccess(savedFeedback, "Feedback saved successfully");
    } catch (error) {
      console.log("catch error", error);
    }
  }

  export async function sendReservationDataToDriver(
    req: Request,
    res: Response
  ) {
    console.log("sendReservationDataToDriver called...");
    try {
      const driverId = req.params.driverId;
      const passengerId = req.params.passengerId;

      const driver = await UserDao.getUserById(driverId);
      const passenger = await UserDao.getUserById(passengerId);
      const latestRide = await RidesDao.getLatestRideByPassengerId(passengerId);

      console.log("LATEST RIDE", latestRide);

      if (!driver) {
        return res.sendError("Driver not found");
      }

      if (!latestRide) {
        return res.sendError("Driver not found");
      }

      const fromPhone = process.env.TWILIO_PHONE_NUMBER;
      console.log("from phone", fromPhone);

      // const toPhone = driver.phone;

      const toPhone = await RidesDao.getDriverPhoneNumber(driverId);

      if (toPhone) {
        console.log("to phone0000000000", toPhone.phone);
      } else {
        console.log("toPhone is undefined");
      }

      console.log("to phone::::::", toPhone);

      const message = `Please pickup ${passenger.name} from ${latestRide.from.address} and drop them at ${latestRide.to.address}. The price is ${latestRide.price} LKR.`;

      await client.messages.create({
        from: fromPhone,
        to: toPhone.phone,
        body: message, 
      });

      return res.sendSuccess(latestRide, "Reservation data sent to driver");
    } catch (error) {
      console.log("catch error", error);
    }
  }
}
