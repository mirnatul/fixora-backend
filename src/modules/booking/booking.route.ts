import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), bookingController.createBooking)
router.get("/admin", auth(Role.ADMIN), bookingController.getAllBookings)
router.get("/:bookingId", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), bookingController.getBookingDetails)
router.get("/user/:userId", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), bookingController.getBookingForUser)
router.get("/technician/:technicianId", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), bookingController.getBookingForTechnician)
export const bookingRoute = router;