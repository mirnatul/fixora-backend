import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface CategoryData {
    name: string;
    description: string;
}

const createCategory = async (payload: CategoryData) => {
    const category = await prisma.category.create({
        data: { ...payload }
    })

    return category;
}

const getAllCategory = async (role: Role) => {
    if (role === "ADMIN") {
        return await prisma.category.findMany();
    }
    else {
        return await prisma.category.findMany({
            select: {
                name: true,
                description: true
            }
        });
    }
}

export const categoryService = {
    createCategory,
    getAllCategory
}