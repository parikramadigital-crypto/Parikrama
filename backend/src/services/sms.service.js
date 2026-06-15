import axios from "axios";

export const sendSMS = async ({ phone, message, templateId }) => {
  try {
    const response = await axios.get(process.env.SMS_BASE_URL, {
      params: {
        user: process.env.SMS_USER,
        authkey: process.env.SMS_AUTH_KEY,
        sender: process.env.SMS_SENDER_ID,
        mobile: phone,
        text: message,
        templateid: templateId,
        rpt: 1,
      },
    });
    console.log(response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("SMS Error:", error?.response?.data || error.message);

    return {
      success: false,
      error: error?.response?.data || error.message,
    };
  }
};
