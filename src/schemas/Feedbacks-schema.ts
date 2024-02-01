import { Schema, Types, model, Document } from "mongoose";
var mongoose = require("mongoose");

const feedbakcSchema = new mongoose.Schema({
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
  stars: {
    type: Number,
    required: false,
  },
  comment: {
    type: String,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedbacks = mongoose.model("Feedbacks", feedbakcSchema);

export default Feedbacks;
