
import React from 'react'
import API from './api.js'
import { useState } from 'react'
import googleLogo from "../assets/google-icon-logo-svgrepo-com.svg";
import {useForm} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';


const Register = () => {

    const {
      register,
      handleSubmit,
      reset,
      formState: {errors,isSubmitting},
    } = useForm();
    
    const navigate = useNavigate();
    const {setUser} = useAuth();
    const onSubmit = async (data)=>{
      try{
        const response = await API.post('/auth/register',data);
        alert('Register successfuly');
        console.log(response.data);
        setUser(response.data);
        reset();
        navigate('/')

      }catch (error) {
    if (error.response && error.response.data.message) {
      alert(error.response.data.message); // shows "user already existe"
    } else {
       console.log("Error response:", error.response?.data);
      alert('Something went wrong. Please try again.');
    }
    }
  }
  return (
    <>
    <div className=' min-h-screen w-full bg-gray-100 flex items-center justify-center '>

    <div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-8 sm:p-10 text-center'>
      <div className='mt-10'>
      <h1 className='text-3xl font-semibold'>Create you'r account</h1>
      <p className='text-gray-400'>Join us and make fun</p>
      </div>
      <div className='my-6'>
     <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
        <input 
        className='border-[2px] rounded-2xl h-sm py-2 px-4 mb-4'
        autoComplete='off'
         placeholder='email'
         {...register('email', {
          required : 'Email is required',
          pattern : {
            value : /^\S+@\S+\.\S+$/,
            message : 'please enter valide email',
          },
         })}  /> 
         {errors.email && <p className="text-red-600">{errors.email.message}</p>}
         
        <input 
        className='border-[2px] rounded-2xl h-sm py-2 px-4 mb-4'
        autoComplete='new-password'
        placeholder='password'
         type='password'
         {...register('password',{
          required : 'password is required',
            minLength : {
              value : 6,
              message : 'password must be at least 6 character'
            },        
         })}  
         />
          {errors.password && (
              <p className="text-red-500 text-sm mb-2">
                {errors.password.message}
              </p>
            )}

          <button disabled={isSubmitting} className="w-full text-white py-2 rounded-3xl bg-purple-500 hover:bg-purple-600">
           {isSubmitting ? 'Creating...' : "Create account"}
        </button>
     </form>
      </div>
      <div className='flex items-center justify-between my-6'>
        <div className='flex-1 border-t border-gray-400'></div>
        <span className='mx-2 font-bold text-gray-400'>OR</span>
        <div className='flex-1 border-t border-gray-400'></div>
      </div>
              <a href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api/auth/google`} className="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-3xl font-bold hover:bg-gray-100 transition">
              <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
              <p className="font-semibold">Continue with Google</p>
               </a>
        <p className='text-gray-400 mt-4'>Have an account ?<span onClick={()=> navigate("/login")} className='text-purple-500 hover:text-purple-600 font-bold cursor-pointer'>Log in</span></p>

    </div>
    </div>

    </>
  )
}

export default Register;