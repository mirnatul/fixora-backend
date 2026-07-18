import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/", technicianController.getAllTechnician)
router.get("/profile", auth(Role.TECHNICIAN), technicianController.getTechnicianProfile)

router.put("/profile", auth(Role.TECHNICIAN), technicianController.updateTechnicianProfile)

// manage availability
router.put("/availability", auth(Role.TECHNICIAN), technicianController.updateAvailability)


export const technicianRoutes = router;