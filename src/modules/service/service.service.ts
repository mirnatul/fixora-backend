import { ServiceWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { IService, IServiceQuery, IUpdateService } from "./service.interface"

const createService = async (payload: IService, userId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    })

    const service = await prisma.service.create({
        data: { ...payload, technicianId: technician.id }
    })

    return service;
}

const updateService = async (userId: string, serviceId: string, payload: IUpdateService) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: { userId }
    })

    const service = await prisma.service.findUnique({
        where: { id: serviceId, technicianId: technician.id }
    })
    if (!service) {
        throw new Error("This service is not yours!!")
    }

    const updatedService = await prisma.service.update({
        where: {
            id: serviceId, technicianId: technician.id
        },
        data: payload
    });

    return updatedService;
}

// get service with filter (type/category, location, rating)
const getService = async (query: IServiceQuery) => {
    const andCondition: ServiceWhereInput[] = [];

    if (query.categoryName) {
        andCondition.push({
            category: {
                name: {
                    equals: query.categoryName,
                    mode: "insensitive",
                }
            }
        })
    }
    if (query.location) {
        andCondition.push({
            location: {
                contains: query.location,
                mode: "insensitive",
            },
        });
    }
    if (query.price) {
        andCondition.push({
            price: {
                gte: Number(query.price),
            },
        });
    }
    if (query.rating) {
        andCondition.push({
            rating: {
                gte: Number(query.rating),
            },
        });
    }
    if (query.active) {
        andCondition.push({
            active: query.active === "true",
        });
    }


    const services = await prisma.service.findMany({
        where: {
            AND: andCondition
        }
    });

    const totalServiceCount = await prisma.service.count({
        where: {
            AND: andCondition
        }
    })

    return {
        total: totalServiceCount,
        services: services
    };
}


export const serviceService = {
    createService,
    getService,
    updateService
}