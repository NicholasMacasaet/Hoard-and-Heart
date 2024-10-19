import {NextRequest, NextResponse } from "next/server";
import {prisma} from '../../../../prisma/prisma'
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

            const rec_set_count = await prisma.aniRecSet.count({
                where:{
                    aniLoggerId: first_save.id
                }
            })

            console.log(`total rec sets saved : ${rec_set_count}`)
            if( rec_set_count ===10){
                return new NextResponse("You've reached your maximum amount of recommendation sets, please delete one before adding this one", {
                    status:403
                })

            }


            const new_set = await prisma.aniRecSet.create({
                data:{
                    emotion,
                    aniLoggerId:first_save.id,
                    animeList:animes
                }
            })

            console.log(`new set id: ${new_set.id}`)
            return new NextResponse(`Recommendation set saved successfully, total sets saved:${rec_set_count+1}`,{
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


export async function DELETE(request:NextRequest) {
    try{
        const body = await request.json()
        const {id} = body
        const to_delete = await prisma.aniRecSet.findFirst({
            where:{
                id:id
            }
        })
        let deletion_id = to_delete.id
        if(!to_delete){
            //reasouce doesnt exist
            return new NextResponse("Invalid id",{
                status:404
            })
        }else{
            await prisma.aniRecSet.delete({
                where:{
                    id:to_delete.id
                }
            })
            return new NextResponse(`Recommendation set ${deletion_id} successfully deleted`,{
                status:201
            })
        }


    }catch(error){
        console.error('Error processing request:', error);
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }



    return new NextResponse("hewwo its so nice to see you :D", { status: 200 })
}