"use client";
// import Login from "./_components/login_button/page";
// import Logout from "./_components/logout_button/page";
import Register from "./_components/register_button/page";
import Profile from "./_components/profile_button/page";
import AuthButton from "./_components/auth_button/page";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie'
import UserButton from "./_components/user_button/page";



export default function Navbar(){
    const [userData,setUserData] = useState(null)
    const token = Cookies.get("token")
    useEffect(()=>{
        // const cookieStore = cookies()
        // const token = cookieStore.get("token").value
        
        console.log(`Cookie: ${token}`)
        if(token){
            //we only care if the cookie exists so we can render the specific buttson 
            try{
                const user_data= jwt.verify(token, process.env.TOKEN_SECRET!);
                setUserData(user_data)
                console.log("logged in")
            }catch(error){
                console.log(error)
            }
        }
        console.log(`logged in: ${userData}`)
    },[])
    
    return(
        <>
            <header className="flex flex-row items-center justify-between border-white border-2 h-10 w-screen">
                <div>
                    {/* {userData ?(<Logout/>):(<Login/>)} */}
                   <AuthButton token={token}></AuthButton>
                </div>

                <div>
                    {/* {userData ? (<Profile/>):(<Register/>)} */}
                    <UserButton token={token}></UserButton>
                </div>

            </header>
        </>
    );
}