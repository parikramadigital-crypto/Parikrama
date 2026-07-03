import { Router } from "express";
import {
  createPayment,
  getPaymentTransaction,
  verifyPayment,
  paymentWebhook,
  retryPayment,
} from "../controllers/payment.controllers.js";

const router = Router();

router.post("/create", createPayment);
router.get("/transaction/:transactionId", getPaymentTransaction);
router.post("/verify", verifyPayment);
router.post("/webhook", paymentWebhook);
router.post("/retry/:transactionId", retryPayment);

export default router;