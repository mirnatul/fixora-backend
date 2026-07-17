import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";

export interface payloadUpdateProfile {
    bio: string;
    experience: number;
    isAvailable: boolean;
}

export interface TechnicianQuery extends TechnicianProfileWhereInput {
    experience?: number;
    averageRating?: string;
    isAvailable?: boolean;
    verified?: boolean;
}