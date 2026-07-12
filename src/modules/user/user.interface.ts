import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    profileImage?: string;
    phone: string;
    address: string;
    city: string;
    role: Role
}