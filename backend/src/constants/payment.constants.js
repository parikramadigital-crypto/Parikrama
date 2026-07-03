export const PAYMENT_GATEWAYS = Object.freeze({
  RAZORPAY: "Razorpay",
});

export const PAYMENT_STATUS = Object.freeze({
  CREATED: "Created",
  PENDING: "Pending",
  AUTHORIZED: "Authorized",
  CAPTURED: "Captured",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  REFUND_INITIATED: "Refund Initiated",
  EXPIRED: "Expired",
});

export const BOOKING_STATUS = Object.freeze({
  CREATED: "Created",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
});

export const PAYMENT_MODULES = Object.freeze({
  CITY_DARSHAN: "CityDarshan",
  HOTEL: "Hotel",
  PACKAGE: "TravelPackage",
  FACILITATOR: "Facilitator",
  CLUB: "Club",
  PROMOTION: "Promotion",
  SUBSCRIPTION: "Subscription",
});