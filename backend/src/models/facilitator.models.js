import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const facilitatorSchema = new mongoose.Schema(
  {
    /* ================= AUTH / LOGIN ================= */
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true, // allows login via phone instead
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // NEVER return password
    },

    refreshToken: {
      type: String,
      select: false,
    },

    lastLoginAt: Date,

    /* ================= BASIC PROFILE ================= */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      // enum: ["Guide", "Pandit", "Instructor", "Local Host"],
      required: true,
    },

    bio: String,

    experienceYears: {
      type: Number,
      default: 0,
    },

    languages: [String],

    /* ================= LOCATION ================= */
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    /* ================= IMAGES ================= */
    images: [
      {
        url: String,
        fileId: String,
      },
    ],

    /* ================= VERIFICATION ================= */
    verification: {
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },

      documentNumber: {
        type: String,
      },

      documents: [
        {
          // type: String,
          url: String,
          fileId: String,
        },
      ],

      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },

      remarks: String,
      verifiedAt: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    /* ================= SUBSCRIPTION ================= */
    subscription: {
      plan: {
        type: String,
        enum: ["Free", "Basic", "Premium"],
        default: "Free",
      },

      startDate: Date,
      endDate: Date,

      benefits: {
        priorityListing: {
          type: Boolean,
          default: false,
        },
        maxBookingsPerMonth: {
          type: Number,
          default: 10,
        },
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      paymentId: String,
    },

    /* ================= AVAILABILITY SLOTS ================= */
    slots: [
      {
        date: {
          type: Date,
          required: true,
        },

        startTime: {
          type: String, // "09:00"
          required: true,
        },

        endTime: {
          type: String, // "11:00"
          required: true,
        },

        isBooked: {
          type: Boolean,
          default: false,
        },
      },
    ],

    /* ================= BOOKINGS ================= */
    bookings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        slotId: mongoose.Schema.Types.ObjectId,

        bookingDate: Date,

        status: {
          type: String,
          enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
          default: "Pending",
        },

        amountPaid: Number,
        paymentId: String,
      },
    ],

    /* ================= STATS ================= */
    ratings: {
      communicationAvg: { type: Number, default: 0 },
      knowledgeAvg: { type: Number, default: 0 },
      behaviourAvg: { type: Number, default: 0 },
      overallAvg: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },

    reviews: [
      {
        customerName: {
          type: String,
          required: true,
        },

        customerPhone: {
          type: String,
          required: true,
        },

        communication: {
          type: Number,
          min: 0,
          max: 5,
          required: true,
        },

        knowledge: {
          type: Number,
          min: 0,
          max: 5,
          required: true,
        },

        behaviour: {
          type: Number,
          min: 0,
          max: 5,
          required: true,
        },

        comment: {
          type: String,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    totalBookings: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

facilitatorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

facilitatorSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

facilitatorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Facilitator" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

facilitatorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "Facilitator" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

export const Facilitator = mongoose.model("Facilitator", facilitatorSchema);
