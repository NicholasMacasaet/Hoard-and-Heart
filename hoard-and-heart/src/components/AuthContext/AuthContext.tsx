"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
interface authContextType{
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) =>void
}

const AuthContext = createContext<authContextType>({
    isLoggedIn: false,
    setIsLoggedIn: ()=>{}
  });


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({children}: {children:ReactNode}){
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    useEffect(()=>{
        const token = Cookies.get("token")
        if(token){
            setIsLoggedIn(true)
    
        }
        else{
            setIsLoggedIn(false)
        }
        console.log(`user is logged in (context): ${isLoggedIn}`)
    },[isLoggedIn])

    return(
        <>
        <AuthContext.Provider value ={{isLoggedIn, setIsLoggedIn}}>
        {children}
        </AuthContext.Provider>
        </>
    )

}