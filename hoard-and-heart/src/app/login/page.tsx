"use client"
import { useState } from "react";
import axiosInstance from "../../axios/axios";
import { useRouter } from 'next/navigation';
import { useAuth } from "../../components/AuthContext/AuthContext";
export default function Login (){

    const router = useRouter()
    const {setIsLoggedIn} = useAuth()

    const [userInfo, setUserInfo] = useState({
        email:"",
        password:""
    })
    const parseEmail = (e) =>{
        setUserInfo( prevUserInfo => ({
            ...prevUserInfo,
            email: e.target.value
        })
        )
    }
    const parsePass = (e) =>{
        setUserInfo( prevUserInfo => ({
            ...prevUserInfo,
            password: e.target.value
        })
        )
    }

    const handleLogin = async (e) =>{
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        e.preventDefault()

        // console.log(`email: ${userInfo.email}`)
        // console.log(`password: ${userInfo.password}`)
        try {
            const response = await axiosInstance.post("api/auth/login/",{
                email: userInfo.email,
                password: userInfo.password
            })
            if(response.status == 200){
                router.push("/profile")
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoggedIn(true)
    }
    
    
    return(
        <>
        <div className="flex justify-center font-[family-name:var(--font-jb-mono)] w-screen h-fitflex">
            <form className="w-3/4 flex flex-col items-center space-y-7" onSubmit={handleLogin}>
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl">
                        Welcome back!
                    </h1>
                    <h2>
                        Please log in
                    </h2>
                </div>

                <div className="flex flex-col p-8 space-y-4 w-11/12 grid-container max-w-96 input-container rounded">
                    <div className="flex flex-col md:flex-row w-full md:justify-end">
                        <label htmlFor="email" className="md:text-end">
                            Email:
                        </label>
                        <input type="text" id="email" className="login-form-item rounded" 
                        placeholder="TheDocter@tardis.com" onInput={parseEmail}/>
                    </div>

                    <div className="flex flex-col md:flex-row w-full md:justify-end">
                        <label htmlFor="password" className="md:text-end">
                            Password:
                        </label>
                        <input type="password" id="password" className="login-form-item rounded" 
                        placeholder="wibbly wobbly timey wimey" onInput={parsePass}/>
                    </div>
                </div>

                <button className="login-button rounded" type="submit">
                    <p className="opacity-75">
                        Log in
                    </p>
                </button> 
            </form>
        </div>
            

              {/* <div className="grid grid-cols-2 p-8 space-y-2 border-2 w-11/12 grid-container max-w-96 min-w-28">
                    <label htmlFor="email"className="text-end flex flex-col justify-center">
                        Email: 
                    </label>
                    <input type="text" id="email"className="login-form-item rounded"/>
   
                    <label htmlFor="password"className="text-end flex flex-col justify-center">
                        Password:
                    </label>
                    <input type="password" id="password"className="login-form-item rounded"/>
                </div> */}
           
        </>
    );
}