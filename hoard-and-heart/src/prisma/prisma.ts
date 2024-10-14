import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
dotenv.config();


const prisma = new PrismaClient()

//console.log("DATABASE_URL:", process.env.DATABASE_URL);

if (process.env.NODE_ENV === 'development') {
    // Prevent multiple Prisma Client instances in development
    if (!global.prisma) {
      global.prisma = prisma;
    }
  }


export {prisma}