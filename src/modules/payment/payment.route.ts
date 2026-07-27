import { Router } from "express";
import { paymentController } from "./payment.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router()

router.post("/checkout/:bookingId", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), paymentController.createCechoutSession)
router.post("/webhook", paymentController.handleWebhook)
export const paymentRoute = router;