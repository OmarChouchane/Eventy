import { type Document, Schema, model, models } from "mongoose";

export interface IBooking extends Document {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  resources: {
    resourceId: Schema.Types.ObjectId;
    quantity: number;
  }[];
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  resources: [
    {
      resourceId: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Use models directly from mongoose import to avoid undefined access
const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
