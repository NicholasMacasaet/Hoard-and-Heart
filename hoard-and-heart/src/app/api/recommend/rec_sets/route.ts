import {NextRequest, NextResponse } from "next/server";
import {prisma} from '../../../../prisma/prisma'
import jwt from "jsonwebtoken"


export async function GET(request:NextRequest) {
    //get all rec_sets for the logged in user
    const token = request.cookies.get('token')?.value
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    try{
        const user_logger = await prisma.aniLogger.findFirst({
            where:{
                userId:decodedToken.id
            }
        })

        if(!user_logger){
            return NextResponse.json({
                message:"You have not saved any recommendation sets, please add one"
            },{
                status:500
            })
        }
        const all_rec_sets = await prisma.aniRecSet.findMany({
            where:{
                aniLoggerId:user_logger.id
            }
        })
        return NextResponse.json({
            message:"Successfully retrieved reccommendation sets for logged in user",
            rec_sets: all_rec_sets
        },{
            status:200
        })
    }catch(error){
        console.error('Error processing request:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }





    return new NextResponse("hewwo its so nice to see you :D", { status: 200 })

  }