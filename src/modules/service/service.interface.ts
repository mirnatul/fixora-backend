import { ServiceWhereInput } from "../../../generated/prisma/models";

export interface IService {
    title: string;
    description: string;
    price: number;
    duration: number;
    location: string;
    categoryId: string;  // in frontend dropdown
}

export interface IServiceQuery {
    categoryName?: string;
    location?: string;
    price?: number;
    rating?: number;
    active?: string;
}