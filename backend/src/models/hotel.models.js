import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: String,
    shortDescription: String,

    propertyType: {
      type: String,
      // enum: [
      //   "Hotel",
      //   "Resort",
      //   "Guest House",
      //   "Homestay",
      //   "Hostel",
      //   "Boutique",
      //   "Villa",
      //   "Apartment",
      // ],
      default: "Hotel",
    },
    starRating: { type: Number, min: 0, max: 5 },
    category: [String],
    tags: [String],

    address: {
      line1: String,
      line2: String,
      locality: String,
      landmark: String,
      pincode: String,
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
      },
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
      },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    contact: {
      phone: String,
      email: { type: String, lowercase: true, trim: true },
      website: String,
      bookingUrl: String,
    },

    images: {
      cover: {
        url: String,
        fileId: String,
      },
      gallery: [
        {
          url: String,
          fileId: String,
          caption: String,
        },
      ],
    },

    amenities: [
      {
        type: String,
        // enum: [
        //   "Free WiFi",
        //   "Parking",
        //   "Breakfast Included",
        //   "Swimming Pool",
        //   "Spa",
        //   "Fitness Center",
        //   "Airport Shuttle",
        //   "Room Service",
        //   "Laundry",
        //   "Bar",
        //   "Restaurant",
        //   "Pet Friendly",
        //   "Family Rooms",
        //   "Business Center",
        //   "Conference Hall",
        //   "Children Play Area",
        //   "Wheelchair Accessible",
        //   "Spa",
        //   "24/7 Front Desk",
        //   "Safe Deposit Box",
        // ],
      },
    ],

    services: [String],
    featuredFacilities: [String],

    rooms: [
      {
        roomType: String,
        description: String,
        occupancy: {
          adults: Number,
          children: Number,
        },
        bedType: String,
        areaSqFt: Number,
        totalRooms: Number,
        availableRooms: Number,
        price: Number,
        currency: { type: String, default: "INR" },
        refundable: { type: Boolean, default: true },
        breakfastIncluded: { type: Boolean, default: false },
        amenities: [String],
        images: [
          {
            url: String,
            fileId: String,
          },
        ],
      },
    ],

    pricing: {
      averagePrice: Number,
      minPrice: Number,
      maxPrice: Number,
      currency: { type: String, default: "INR" },
      priceIncludesTaxes: { type: Boolean, default: false },
      extraCharges: [
        {
          name: String,
          amount: Number,
          description: String,
        },
      ],
    },

    policies: {
      checkInTime: String,
      checkOutTime: String,
      cancellationPolicy: String,
      smokingAllowed: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      childrenAllowed: { type: Boolean, default: true },
      paymentOptions: [String],
    },

    nearbyAttractions: [
      {
        name: String,
        distanceKm: Number,
        type: String,
      },
    ],

    nearestTransport: [
      {
        type: String,
        name: String,
        distanceKm: Number,
      },
    ],

    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      distribution: {
        oneStar: { type: Number, default: 0 },
        twoStar: { type: Number, default: 0 },
        threeStar: { type: Number, default: 0 },
        fourStar: { type: Number, default: 0 },
        fiveStar: { type: Number, default: 0 },
      },
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserSchema",
        },
        rating: Number,
        title: String,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    partnerClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    popularityScore: { type: Number, default: 0 },
    totalRooms: Number,
    availableRooms: Number,
    awards: [String],
    certifications: [String],
    externalReferences: {
      sabreId: String,
      amadeusId: String,
      expediaId: String,
    },
  },
  { timestamps: true },
);

hotelSchema.index({ location: "2dsphere" });

export const Hotels = mongoose.model("Hotels", hotelSchema);
