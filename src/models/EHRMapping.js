import mongoose, { Schema } from "mongoose";

const EHRMappingSchema = new Schema(
  {
    question: { type: String, required: true },
    endpoint: { type: String, required: true },
    ehrSystem: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("EHRMapping", EHRMappingSchema);
