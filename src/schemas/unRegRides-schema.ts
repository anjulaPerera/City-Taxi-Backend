import { Schema, Types, model, Document } from 'mongoose';
var mongoose = require("mongoose");



const unRegSchema = new mongoose.Schema({

    passengerName: {
        type: String,
        required: true,
    },
    
    passengerPhone: {
        type: String,
        required: true,
    },
    
    driverId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    from: {
        type: String,
        required: true,
    },
    
    to: {
        type: String,
        required: true,
    },
    
    date: {
        type: Date,
        required: true,
    },
    
    time: {
        type: String,
        required: true,
    },
    
    price: {
        type: Number,
        required: false,
    },
    
    vehicleType: {
        type: String,
        required: true,
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const UnRegRides = mongoose.model("UnRegRides", unRegSchema);

export default UnRegRides;
