import {NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../prisma/prisma";
import jwt from "jsonwebtoken"
// import { signIn } from '@/auth'



export async function POST(request:NextRequest) {
    const {email, password} = await request.json()
    try{
        const user = await prisma.user.findFirst({
            where:{email}
        })
        if(!user){
            return new NextResponse("User does not exist",{
                status:401
            })
        }
        const valid = await bcrypt.compare(password,user.password)
        if (!valid){
            return new NextResponse("Password does not match.",{
                status:401
            })
        }
        const tokenData= {
            id: user.id,
            username: user.name,
            email: user.email,
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!,{expiresIn:"1d"})
        
        const response = NextResponse.json({
            message: `Login Successful, welcome ${user.name}`,
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly:true,
            path:"/"
        })
        return response

    }catch(error){
        return new NextResponse(error.message,{
            status:500
        })
    }
}



  
  