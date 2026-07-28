import { Router } from "express";
import { serviceController } from "./service.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/", auth(Role.TECHNICIAN), serviceController.createService)
router.get("/", serviceController.getService)
router.patch("/:serviceId", auth(Role.TECHNICIAN), serviceController.updateService)

export const serviceRoutes = router;
