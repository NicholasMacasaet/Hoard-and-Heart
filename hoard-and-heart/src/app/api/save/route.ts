import {NextRequest, NextResponse } from "next/server";
import {prisma} from '../../../prisma/prisma'
import jwt from "jsonwebtoken"
export async function POST(request:NextRequest){
    //return new NextResponse("hewwo its so nice to see you :D", { status: 200 })
    const token = request.cookies.get('token')?.value

    try{
        const body = await request.json()
        const {animes, emotion} = body
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
        // const current_user = await prisma.

        console.log(`user ${decodedToken.id}`)

        const first_save = await prisma.aniLogger.findFirst({
            where:{
                userId:decodedToken.id
            }
        })

        console.log(`first save ${first_save}`)
        //if the user is making their first save, make an ani logger
        if(!first_save){
            const new_logger = await prisma.aniLogger.create({
                data:{
                    userId: decodedToken.id,
                    recs:{
                        create: {
                            emotion,
                            animeList: animes
                        }
                    },
                }
            })
            console.log(`new logger ${new_logger}`)

            return new NextResponse("Recommendation set saved successfully and logger made",{
                status:201
            })
        }
        else{

            const new_set = await prisma.aniRecSet.create({
                data:{
                    emotion,
                    aniLoggerId:first_save.id,
                    animeList:animes
                }
            })
            return new NextResponse("Recommendation set saved successfully",{
                status:201
            })

        }
        //if the user is making another save,
    }catch (error) {
        console.error('Error processing request:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }


}