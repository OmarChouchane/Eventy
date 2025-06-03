// lib/database/models/resource.model.ts

import mongoose, { Schema, Document } from "mongoose";

export type ResourceType = "room" | "equipment" | "material";

export interface IResource extends Document {
  name: string;
  type: ResourceType;
  description?: string;
  quantity: number;
  available: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["room", "audiovisual", "material"],
      required: true,
    },
    description: { type: String },
    quantity: { type: Number, default: 1 },
    available: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resource ||
  mongoose.model<IResource>("Resource", ResourceSchema);
