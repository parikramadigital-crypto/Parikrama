import crypto from "crypto";

export const generateTransactionNumber = () => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  const date = new Date();

  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `PKM-${yy}${mm}${dd}-${random}`;
};
