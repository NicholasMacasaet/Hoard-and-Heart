

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '../../../AuthContext/AuthContext';

// interface tokenWeeWoo{
//     token?:string
// }

export default function UserButton(){
    // const[loggedIn,setLoggedIn] = useState(false)
    const router = useRouter()
    // useEffect(()=>{
    //     const token = Cookies.get("token")
    //     setLoggedIn(!!token)
    // },[loggedIn])

    const{isLoggedIn,setIsLoggedIn} = useAuth()
    console.log(`user is logged in (userbutton): ${isLoggedIn}`)


    const handleRedirect = ()=>{
        if(isLoggedIn){
            router.push("profile")
        }
        else{
            router.push("register")
        }
    }

    return(
        <>
        <button onClick={handleRedirect}>
            {isLoggedIn ? "Profile": "Register"}
        </button>
        </>
    )


    // const UserButton:React.FC<tokenWeeWoo> = ({token}) =>{
//     const router = useRouter();
//     const redirectProfile = () =>{
//         router.push("profile")
//     }
//     const redirectRegister = () =>{
//         router.push("register")
//     }
//     return(
//         <button onClick={token? redirectProfile:redirectRegister }>
//             {token ?'Profile':'Register'}
//         </button>
//     );

// }

// export default UserButton
}