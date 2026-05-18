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
    corporate: {
      companyName: { type: String, trim: true },
      companyEmail: { type: String, trim: true },
      contactPersonName: { type: String, trim: true },
      contactPersonDesignation: { type: String, trim: true },
      contactNumber: { type: String, trim: true },
      comments: { type: String },
    },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    customerFeedBack: { type: String, trim: true },
    reviewedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const EnquiryDetails = mongoose.model("EnquiryDetails", enquirySchema);
