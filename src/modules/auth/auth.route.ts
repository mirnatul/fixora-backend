import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();


router.post("/login", authController.loginUser)

router.get("/me", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), authController.getMyProfile)
router.put("/me/update", auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER), authController.updateMyInfo)

export const authRoutes = router;