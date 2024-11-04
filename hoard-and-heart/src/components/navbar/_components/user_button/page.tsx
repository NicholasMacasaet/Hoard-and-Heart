

import { useRouter } from 'next/navigation';

interface tokenWeeWoo{
    token?:string
}

const UserButton:React.FC<tokenWeeWoo> = ({token}) =>{
    const router = useRouter();
    const redirectProfile = () =>{
        router.push("profile")
    }
    const redirectRegister = () =>{
        router.push("register")
    }
    return(
        <button onClick={token? redirectProfile:redirectRegister }>
            {token ?'Profile':'Register'}
        </button>
    );

}

export default UserButton