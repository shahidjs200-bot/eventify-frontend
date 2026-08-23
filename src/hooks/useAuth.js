import { useContext } from "react";
import { AuthContext } from "../context/Authcontext";

const useAuth = () => {
  const context = useContext(AuthContext);

  if(!context){
    throw new Error('useAuth should use in authprovider');    
  }
  return context;
};
export default useAuth;