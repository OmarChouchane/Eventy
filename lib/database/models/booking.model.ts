import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  eventId: mongoose.Schema.Types.ObjectId;
  resources: {
    resourceId: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  resources: [
    {
      resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
