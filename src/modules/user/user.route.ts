import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser)

router.get("/admin/users", auth(Role.ADMIN), userController.getAllUser)

router.patch("/admin/users/:userId", auth(Role.ADMIN), userController.updateUserStatus)

// update user info
router.patch("/update-user-info", auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), userController.updateUserInfo)



export const userRoutes = router;