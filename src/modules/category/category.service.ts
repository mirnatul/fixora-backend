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

const getAllCategory = async () => {
    return await prisma.category.findMany();
}

export const categoryService = {
    createCategory,
    getAllCategory
}