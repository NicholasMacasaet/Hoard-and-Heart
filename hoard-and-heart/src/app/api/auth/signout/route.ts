import { NextResponse } from "next/server";


export async function POST() {
    try {
        const response = NextResponse.json({
            message: "Logout Successful, goodbye.",
            success: true,
        })
        response.cookies.set("token",'',{
            httpOnly:true,
            expires: new Date(0),
            path:'/'
        })
        return response
    } catch (error) {
        return new NextResponse(error.message,{
            status:500
        })

    }
    
}