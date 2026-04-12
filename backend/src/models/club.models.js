import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Travel Club",
        "Adventure Club",
        "Religious Club",
        "Bike Club",
        "Business Club",
        "Social Club",
      ],
      default: "Social Club",
    },

    contactDetails: {
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      phone: String,
      website: String,
    },

    location: {
      address: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    images: {
      logo: {
        url: String,
        fileId: String,
      },
      coverImage: {
        url: String,
        fileId: String,
      },
      gallery: [
        {
          url: String,
          fileId: String,
        },
      ],
    },

    amenities: [
      {
        type: String,
        enum: [
          "Accommodation",
          "Dining",
          "Gym",
          "Spa",
          "Swimming Pool",
          "Event Hall",
          "Travel Assistance",
        ],
      },
    ],

    membershipPlans: [
      {
        name: String,
        price: Number,
        durationMonths: Number,
        benefits: [String],
      },
    ],

    parikramaMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
      },
    ],
    
    parikramaHotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotels",
      },
    ],

    members: [
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        contactNumber: { type: String, trim: true },
        address: { type: String },
        city: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "City",
        },
        state: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "State",
        },
      },
    ],

    events: [
      {
        title: String,
        date: Date,
        description: String,
      },
    ],

    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    foundedYear: Number,

    adminVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true },
);

export const Club = mongoose.model("Club", clubSchema);
