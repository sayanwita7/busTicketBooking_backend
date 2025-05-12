import mongoose, { Schema } from "mongoose";
//import { bus } from "./path_to_bus_model";

const ticketSchema = new Schema({
  passenger: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bus: {
    type: Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  }
}, { timestamps: true, versionKey: false });

// Add pre-save validation for origin and destination
ticketSchema.pre("save", async function (next) {
  const ticket = this;
  const busDoc = await bus.findById(ticket.bus);
  if (!busDoc) return next(new Error("Bus not found"));

  const stops = busDoc.stops.split(",").map(stop => stop.trim().toLowerCase());
  if (!stops.includes(ticket.origin.toLowerCase()) || !stops.includes(ticket.destination.toLowerCase())) {
    return next(new Error("Origin or destination must be one of the bus stops"));
  }
  next();
});

export const ticket = mongoose.model("Ticket", ticketSchema);
