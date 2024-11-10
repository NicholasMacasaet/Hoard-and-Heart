

//import { redirect } from "next/dist/server/api-utils"
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation'
import axiosInstance from "../../../../axios/axios"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { log } from 'console';
import { useAuth } from '../../../AuthContext/AuthContext';

export default function AuthButton(){
    const router = useRouter()
    // const[loggedIn,setLoggedIn] = useState(false)
    const{isLoggedIn,setIsLoggedIn} = useAuth()
    console.log(`user is logged in (authbutton): ${isLoggedIn}`)

    // useEffect(()=>{
    //     const token = Cookies.get("token")
    //     setLoggedIn(!!token)
    // },[loggedIn])

    const handleAuth = async()=> {
        if(isLoggedIn){
            try{
                await axiosInstance.post("api/auth/signout")
            }catch(error){
                console.log(error)
            }
            setIsLoggedIn(false)
        }else{
            router.push("login")
        }

    }
    return(
        <>
        <button onClick={handleAuth}>
            {isLoggedIn ? 'Logout': 'Login'}
        </button>
        </>
    )

}


// interface tokenWeeWoo{
//     token?:string
// }
// const AuthButton:React.FC<tokenWeeWoo> = ({token}) =>{
//     const router = useRouter()
//     const handleLogout = async () => {
//         //if there is we log out the user 
//         try {
//         const response = await axiosInstance.post("api/auth/signout")
//            router.push("/")
//         } catch (error) {
//             console.log(error)
//         }
        
//     }
//     const handleLogin = () =>{
//         router.push("login")
//     }

//     return(
//         <button onClick={token? handleLogout: handleLogin}>
//             {token ?'Logout':'Login'}
//         </button>
//     )
// }

//export default AuthButton