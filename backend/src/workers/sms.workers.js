import { SMS_TEMPLATES } from "../constants/sms.constants.js";
import { sendSMS } from "../services/sms.service.js";

export const sendOtpSMS = async (phone, otp) => {
  const message = `Welcome to Parikrama! Your registration OTP is ${otp}. Valid for 10 minutes. Please do not share it with anyone. - Team Parikrama`;

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.OTP,
  });
};

export const sendLoginOtpSMS = async (phone, otp) => {
  const message = `Welcome to Parikrama! Your login OTP is ${otp}. Valid for 10 minutes. Please do not share it with anyone. - Team Parikrama`;

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.OTP_LOGIN,
  });
};

export const sendWelcomeSMS = async (phone) => {
  const message =
    "Welcome to Parikrama! Your registration is successful. Explore flights, hotels, holidays & more. Happy Travelling! - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.WELCOME,
  });
};

export const sendClubRegistrationSMS = async (phone) => {
  const message =
    "Welcome to Parikrama! Your Club registration is successful. Enjoy exclusive benefits and travel experiences. - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.CLUB_REGISTRATION,
  });
};

export const sendPackageEnquirySMS = async (phone) => {
  const message =
    "Your dream journey starts here! We have received your package enquiry and will share the best travel options shortly. - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.PACKAGE_ENQUIRY,
  });
};

export const sendPlaceSubmissionSMS = async (phone) => {
  const message =
    "Your place listing has been submitted successfully on Parikrama and is under review. We'll notify you once it is activated. - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.PLACE_SUBMISSION,
  });
};

export const sendPlaceApprovalSMS = async (phone) => {
  const message =
    "Congratulations! Your place listing has been approved and activated on Parikrama. Start reaching more places today. - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.PLACE_APPROVAL,
  });
};

export const sendFlightEnquirySMS = async (phone) => {
  const message =
    "Your flight enquiry has been received by Parikrama. Our team will contact you shortly with the best available fares. - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.FLIGHT_ENQUIRY,
  });
};

export const sendHotelEnquirySMS = async (phone) => {
  const message =
    "Your Hotel enquiry has been received by Parikrama. Our team will contact you shortly with the best available fares. - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.HOTEL_ENQUIRY,
  });
};

export const sendFacilitatorRegistrationSMS = async (phone) => {
  const message =
    "Thank you for registering as a facilitator on Parikrama. Your profile is under review. - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.FACILITATOR_REGISTERATION,
  });
};

export const sendFacilitatorApprovalSMS = async (phone) => {
  const message =
    "Congratulations! Your facilitator profile has been approved. You can now start managing your services on Parikrama. - Team Parikrama";

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.FACILITATOR_APPROVAL,
  });
};

export const sendPaymentSuccessSMS = async (phone, amount, bookingId) => {
  const message = `Payment of Rs. ${amount} has been received successfully for booking ID ${bookingId}. Thank you for choosing Parikrama`;

  return await sendSMS({
    phone,
    message,
    templateId: SMS_TEMPLATES.HOTEL_ENQUIRY,
  });
};
