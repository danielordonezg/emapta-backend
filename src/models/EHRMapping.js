import mongoose, { Schema } from "mongoose";

const EHRMappingSchema = new Schema(
  {
    mapping: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EHRMapping", EHRMappingSchema);
