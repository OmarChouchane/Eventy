import { type Document, Schema, model, models } from "mongoose";

export interface IRegistration extends Document {
  _id: string;
  user: { _id: string; firstName: string; lastName: string; email: string };
  event: { _id: string; title: string; startDateTime: Date; endDateTime: Date };
  status: "confirmed" | "cancelled";
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent redefining model in development
const Registration =
  models.Registration || model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
