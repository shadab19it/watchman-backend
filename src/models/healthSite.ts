import mongoose, { Document } from "mongoose";

interface HealthSite extends Document {
  websiteName: string;
  resTime: number;
  isUp: boolean;
  totalReq: number;
  lastdownTime: number;
  timestamps: string;
}

const healthSiteSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
    },
    resTime: {
      type: Number,
      required: true,
    },
    isUp: {
      type: Boolean,
      required: true,
    },
    totalReq: {
      type: Number,
    },
    lastDownTime: Date,
    lastResTime: Date,
  },
  { timestamps: true }
);

export default mongoose.model<HealthSite>("HealthOfSite", healthSiteSchema);
