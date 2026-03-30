import { Worker } from "bullmq";
import { redisConnection } from "../utils/redis.js";
import { sendMailService } from "../services/mail.service.js";

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { type, data } = job.data;

    // switch (type) {
    //   case "SEND_EMAIL":
    //     console.log("📨 Processing email job...");
    //     await sendMailService(data);
    //     console.log("✅ Email sent successfully");
    //     break;

    //   default:
    //     console.log("❌ Unknown job type");
    // }
    switch (type) {
      case "WELCOME_EMAIL":
        console.log("📨 Sending Welcome Email...");
        await sendMailService(data);
        break;

      case "OTP_EMAIL":
        console.log("🔐 Sending OTP Email...");
        await sendMailService(data);
        break;

      default:
        console.log("❌ Unknown job type");
    }
  },
  {
    connection: redisConnection,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job.id}`, err);
});
