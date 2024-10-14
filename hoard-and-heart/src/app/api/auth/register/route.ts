import {NextRequest, NextResponse } from "next/server";
// import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from '../../../../prisma/prisma'
// import { prisma } from 'pri'
import bcrypt from "bcryptjs";
//const prisma = new PrismaClient()


export async function POST(request:NextRequest){

    const {name, email, password} = await request.json()

    const encrypt_pass = await bcrypt.hash(password,17)


    const newUser = {
        email,
        name,
        password: encrypt_pass,
    }

    try{
        const user_exists = await prisma.user.findFirst({
            where:{
                email: email,
            }
        })
        

        if (user_exists){
            return new NextResponse("Account already exists",{
                status:409
            })
        }


        const hewwoItsSoNiceToSeeYou = await prisma.user.create({data:newUser})
        console.log(hewwoItsSoNiceToSeeYou)
        //create user
        // const logger = await prisma.aniLogger.create({
        //     data:{
        //         userID: hewwoItsSoNiceToSeeYou.id,
        //         recs: {
        //             create: [],
        //         },
        //     }
        // })
        // console.log(logger)

    
        
        // create a logger with empty rec set

        return new NextResponse("User created successfully", { status: 201 });

    }catch(error){
        return new NextResponse(error.message,{
            status:500
        })
    }


}

// model users{
//     id       String     @id @default(auto()) @map("_id") @db.ObjectId
//     email    String     @unique
//     name     String?
//     password String
//     logger   aniLoggers? 
//   }
  
//   model aniLoggers{
//     id     String       @id @default(auto()) @map("_id") @db.ObjectId
//     user   users        @relation(fields:[userId], references:[id])
//     userId String       @unique @db.ObjectId
//     recs   aniRecSets[] 
//   }
  
//   model aniRecSets{
//     id          String     @id @default(auto()) @map("_id") @db.ObjectId
//     emotion     String
//     created     DateTime   @default(now())
//     aniLogger   aniLoggers @relation(fields:[aniLoggerId], references:[id])
//     aniLoggerId String    @unique @db.ObjectId
//     animeList   Json[]
//   }