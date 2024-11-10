"use server"
import { cookies } from "next/headers";
export async function getToken(){
    const token = cookies().get('token')?.value
    return token
}