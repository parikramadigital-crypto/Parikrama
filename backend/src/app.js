import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import compression from "compression";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedOrigins = [
  process.env.ORIGIN_1,
  process.env.ORIGIN_2,
  process.env.ORIGIN_3,
  process.env.ORIGIN_4,
  process.env.ORIGIN_5,
  process.env.ORIGIN_6,
].filter(Boolean);

const app = express();

// const server = http.createServer(app);

// const corsOptions = {
//   origin: allowedOrigins,
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      return callback(null, false); // ❗ IMPORTANT: don't throw error
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ ONLY THIS
app.use(cors(corsOptions));

// the above line is added to handle preflight requests for all routes, ensuring that CORS headers are sent for OPTIONS requests as well.
// app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" })); // For JSON format
app.use(express.text({ type: "text/*", limit: "10mb" })); // For plain text format
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(trackVisitor);
app.use(compression());
// app.use(limiter);

//print function to ensure every step is executed
app.use((req, res, next) => {
  console.log("--------------------------------");
  console.log(`Received:`, req.method);
  console.log(`at:`, req.url);
  console.log(`with body:`, req.body);
  console.log("Origin:", req.headers.origin);
  next();
});

import stateRoutes from "./routes/state.routes.js";
import cityRoutes from "./routes/city.routes.js";
import placeRoutes from "./routes/place.routes.js";
import routeRoutes from "./routes/route.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import facilitatorRoutes from "./routes/facilitator.routes.js";
import promotionRoutes from "./routes/promotion.routes.js";
import { trackVisitor } from "./middlewares/trackVisitor.middleware.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import cmsRoutes from "./routes/cms.routes.js";
import packageRoutes from "./routes/package.routes.js";
import communityRoutes from "./routes/community.routes.js";
import userRoutes from "./routes/user.routes.js";
import foodCourtRoutes from "./routes/foodCourt.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import clubRoutes from "./routes/club.routes.js";
import publicRoutes from "./routes/public.routes.js";

app.use("/api/v1/states", stateRoutes);
app.use("/api/v1/cities", cityRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/routes", routeRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/facilitator", facilitatorRoutes);
app.use("/api/v1/promotions", promotionRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/cms", cmsRoutes);
app.use("/api/v1/packages", packageRoutes);
app.use("/api/v1/communities", communityRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/foodCourt", foodCourtRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/clubs", clubRoutes);

// Public routes (no API prefix - for user-facing shares)
app.use("/", publicRoutes);

export { app };
