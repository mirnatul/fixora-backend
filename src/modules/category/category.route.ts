import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/", auth(Role.ADMIN), categoryController.createCategory)

router.get("/", auth(Role.ADMIN), categoryController.getAllCategory)


export const categoryRoute = router;