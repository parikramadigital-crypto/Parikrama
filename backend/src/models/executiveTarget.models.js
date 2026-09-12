import mongoose from "mongoose";

const targetHistorySchema = new mongoose.Schema(
  {
    previousFoodPlaceTarget: {
      type: Number,
      required: true,
      min: 0,
    },

    newFoodPlaceTarget: {
      type: Number,
      required: true,
      min: 0,
    },

    previousFacilitatorTarget: {
      type: Number,
      required: true,
      min: 0,
    },

    newFacilitatorTarget: {
      type: Number,
      required: true,
      min: 0,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const executiveTargetSchema = new mongoose.Schema(
  {
    executive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Executive",
      required: true,
      index: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    // Target period
    year: {
      type: Number,
      required: true,
      index: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    // --------------------------------
    // CURRENT ACTIVE TARGET
    // --------------------------------

    foodPlaceTarget: {
      type: Number,
      default: 0,
      min: 0,
    },

    facilitatorTarget: {
      type: Number,
      default: 0,
      min: 0,
    },

    // --------------------------------
    // TARGET CHANGE HISTORY
    // --------------------------------

    history: {
      type: [targetHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// One target document per executive per month
executiveTargetSchema.index(
  {
    executive: 1,
    year: 1,
    month: 1,
  },
  {
    unique: true,
  },
);

export const ExecutiveTarget = mongoose.model(
  "ExecutiveTarget",
  executiveTargetSchema,
);
