import React from 'react'
import { createContext , useEffect , useState } from "react";
import API from '../assets/api';

export const AuthContext = createContext(null)
const AuthProvider = ({children}) => {
    const [User, setUser] = useState(null);
    const [loading, setloading] = useState(true);

    const CheckLogin = async ()=>{
      try{
        const res = await API.get('/auth/me',{withCredentials : true});
        setUser(res.data);
      }catch(error){
       setUser(null);
       console.error({message : error.message});
      }finally{
       setloading(false)
      }
    };
    useEffect(() => {
     CheckLogin();
    }, [])
    
  return (
    <AuthContext.Provider value={{User,setUser,loading}} >
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;