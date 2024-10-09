import { NextRequest, NextResponse } from "next/server"


export async function GET(request:NextRequest) {

    return new NextResponse("hewwo its so nice to see you :D", { status: 200 })

  }