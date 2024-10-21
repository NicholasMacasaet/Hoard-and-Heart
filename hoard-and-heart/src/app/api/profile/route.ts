import {NextRequest, NextResponse } from "next/server";
import {prisma} from '../../../prisma/prisma'
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


export async function GET(request:NextResponse) {
    //returns a user's information to be displayed on their profile 
    const token = request.cookies.get('token')?.value
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    try {
        const curr_user = await prisma.user.findFirst({
            where:{
                id:decodedToken.id
            }
        })
        const {id, email,name, profile_picture} = curr_user
        curr_user
        const user_info={
            "id":id,
            "email":email,
            "username":name,
            "profile_picture": profile_picture
        }

        return NextResponse.json({
            message:"User information successfully retrieved",
            user_info:user_info
        })
    } catch (error) {
        console.log(error)
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}



export async function PATCH(request:NextResponse) {
    //updates a user's information, like changing email or a password 
    const token = request.cookies.get('token')?.value
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    try {
        const body = await request.json()
        const {new_username,new_email,new_pass,new_pfp} = body
        const curr_user = await prisma.user.findFirst({
            where:{
                id:decodedToken.id
            }
        })
        const update_data ={}

        if(new_username){
            if(curr_user.name === new_username){
                return new NextResponse("Username is the same as previous",{
                    status:400
                })
            }
            else{
                update_data['name'] = new_username
            }
        }

        if(new_email){
            if(curr_user.email === new_email){
                return new NextResponse("Email is the same as previous",{
                    status:400
                })
            }
            else{
                update_data['email'] = new_email
            }
            
        }
        if(new_pass){
            //assuming we've checked that the password is not the same as before in the frontend,
            //still doesnt hurt to check it in the backend as well 
            const valid = await bcrypt.compare(new_pass,curr_user.password)
            if(valid){
                return new NextResponse("Password is the same as previous",{
                    status:400
                })
            }
            else{
                const encrypt_pass = await bcrypt.hash(new_pass,17)
                update_data['password'] = encrypt_pass
            }
        }


        if(new_pfp){
            if(curr_user.profile_picture ===new_pfp){
                return new NextResponse("Profile picture is the same as previous",{
                    status:400
                })
            }
            else{
                update_data['profile_picture'] = new_pfp
            }
        }
        await prisma.user.update({
            where:{
                id:curr_user.id
            },
            data:update_data
        })

        return new NextResponse("User data successfully updated",{
            status:200
        })

        
    } catch (error) {
        console.log(error)
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }

}


export async function DELETE(request:NextResponse) {
    //deletes a user's profile, also logging them out
    // TODO: when making user interface make sure to do additional prompting, 
    // for example "ARE YOU SURE YOU WISH TO DO THIS ACTION ?" kind of notification
    const token = request.cookies.get('token')?.value
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    try {

        //first retreive a user's information as well as their 
        const curr_user = await prisma.user.findFirst({
            where:{
                id:decodedToken.id
            }
        })
        // await prisma.user.delete({
        //     where:{
        //         id:curr_user.id
        //     }
        // })
        const user_logger = await prisma.aniLogger.findFirst({
            where:{
                userId:curr_user.id
            }
        })
        const user_rec_sets = await prisma.aniRecSet.findMany({
            where:{
                aniLoggerId:user_logger.id
            }
        })

        if(user_rec_sets){
            await prisma.aniRecSet.deleteMany({
                where:{
                    id:{
                        in: user_rec_sets.map(record => record.id)
                    }
                }
            })
        }
        if(user_logger){
            await prisma.aniLogger.delete({
                where:{
                    id:user_logger.id
                }
            })
        }

        await prisma.user.delete({
            where:{
                id:curr_user.id
            }
        })
        return new NextResponse("User successfully deleted, we'll see you next time!",{
            status:200
        })
    } catch (error) {
        return new NextResponse(error,{
            status:500
        })
    }
    
}



// generator client {
//     provider = "prisma-client-js"
//   }
  
//   datasource db {
//     provider = "mongodb"
//     url      = env("DATABASE_URL")
//   }
  
//   type AnimeDataGenres {
//     id   Int
//     name String
//   }
  
//   type AnimeDataMainPicture {
//     large  String
//     medium String
//   }
  
//   model AnimeData {
//     id           Int                  @id @map("_id")
//     genres       AnimeDataGenres[]
//     main_picture AnimeDataMainPicture
//     synopsis     String
//     title        String
//   }
  
//   model user {
//     id              String @id @default(auto()) @map("_id") @db.ObjectId
//     email           String
//     name            String
//     password        String
//     profile_picture String
//     logger          aniLogger? 
//   }
  
//     model aniLogger{
//       id     String       @id @default(auto()) @map("_id") @db.ObjectId
//       user   user         @relation(fields:[userId], references:[id])
//       userId String       @unique @db.ObjectId
//       recs   aniRecSet[] 
//     }
    
//     model aniRecSet{
//       id          String     @id @default(auto()) @map("_id") @db.ObjectId
//       emotion     String
//       created     DateTime   @default(now())
//       aniLogger   aniLogger  @relation(fields:[aniLoggerId], references:[id])
//       aniLoggerId String     @unique @db.ObjectId
//       animeList   Json[]
//     }
  
  
  