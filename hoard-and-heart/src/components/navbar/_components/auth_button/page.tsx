

//import { redirect } from "next/dist/server/api-utils"
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation'
import axiosInstance from "../../../../axios/axios"
interface tokenWeeWoo{
    token?:string
}
const AuthButton:React.FC<tokenWeeWoo> = ({token}) =>{
    const router = useRouter()
    const handleLogout = async () => {
        //if there is we log out the user 
        try {
            const response = await axiosInstance.post("api/auth/signout")
           router.push("/")
        } catch (error) {
            console.log(error)
        }
        
    }
    const handleLogin = () =>{
        router.push("login")
    }

    return(
        <button onClick={token? handleLogout: handleLogin}>
            {token ?'Logout':'Login'}
        </button>
    )
}

export default AuthButton