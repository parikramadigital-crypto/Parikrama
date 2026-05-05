import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    enquiryType: { type: String, required: true, trim: true },
    formDetails: {
      contactPersonName: { type: String, trim: true },
      contactPersonPhone: { type: String, trim: true },
      contactPersonEmail: { type: String, trim: true },
      comments: { type: String },
      fromCity: { type: String, trim: true },
      toCity: { type: String, trim: true },
      fromDate: { type: Date },
      toDate: { type: Date },
      numberOfPerson: { type: Number },
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
    reviewedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const EnquiryDetails = mongoose.model("EnquiryDetails", enquirySchema);
