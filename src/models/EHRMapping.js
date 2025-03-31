import mongoose, { Schema } from "mongoose";

const EHRMappingSchema = new Schema(
  {
    ehrName: {
      type: String,
      default: ""
    },
    mapping: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EHRMapping", EHRMappingSchema);
