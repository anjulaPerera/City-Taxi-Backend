import { Schema, Types, model, Document } from "mongoose";
var mongoose = require("mongoose");

const regSchema = new mongoose.Schema({
  passengerId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },

  driverId: {
    type: Types.ObjectId,
    ref: "User",
    required: false,
  },

  from: {
    address: {
      type: String,
      required: false,
    },
    coordinates: {
      lat: {
        type: Number,
        required: false,
      },
      lng: {
        type: Number,
        required: false,
      },
    },
  },

  to: {
    address: {
      type: String,
      required: false,
    },
    coordinates: {
      lat: {
        type: Number,
        required: false,
      },
      lng: {
        type: Number,
        required: false,
      },
    },
  },

  date: {
    type: Date,
    required: false,
  },

  time: {
    type: String,
    required: false,
  },

  price: {
    type: Number,
    required: false,
  },

  vehicleType: {
    type: String,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RegRides = mongoose.model("RegRides", regSchema);

export default RegRides;
