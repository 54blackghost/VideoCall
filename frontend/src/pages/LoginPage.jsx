import React, { useState } from 'react'
import {  ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';
import useLogin from "../hooks/useLogin";


const LoginPage = () => {

  const [loginData, setLoginData] = useState({
      email: "",
      password: "",
    });
 
  //This how we do first time without our custom hook
 // const queryClient = useQueryClient();
 //const {
  //  mutate:loginMutation,  
  //  isPending, 
  //  error
  //  } = useMutation({
  //  mutationFn:login,
  //   onSuccess: () => {
   //     queryClient.invalidateQueries({ queryKey: ["authUser"]});
  //   },
   //});
  const {loginMutation,   isPending, error} = useLogin();

   const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-3xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
         {/* LOGIN FROM LEFT SIDE*/}

            <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
            {/* LOGO*/}

            <div className='mb-2 flex items-center justify-start gap-2'>
              <ShipWheelIcon className='size-9 text-primary' />
              <span className='text-3xl font-bold font-mono bg-clip-text text-primary bg-linear-to-r from-primary to-secondary tracking-wider'>
                Streamify
              </span>
            

            {/* ERROR MESSAGE IF ANY*/}
            {error && (
              <div className='alert alert-error mb-4'>
                <span>{error.response.data.message}</span>
              </div>  
            )}
          </div>

          <div className='w-full'>
            <form onSubmit={handleLogin}>
              <div className='space-y-4'>
                   <div>
                      <h2 className='text-xl font-semibold'>Welcome Back</h2>
                      <p className='text-sm opacity-70'>
                        Sign in to your account to continue your lanuage journey
                      </p>
                   </div>

                  <div className='space-y-3'>
                    {/* EMAIL*/}
                     <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Email</span>
                      </label>
                      <input
                        type='email'
                        placeholder='ulrich@gmail.com'
                        className='input input-bordered w-full'
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                      />
                    </div>
                    {/* PASSWORD*/}
                    <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Password</span>
                      </label>
                      <input
                        type='password'
                        placeholder='*********'
                        className='input input-bordered w-full'
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                    </div>
                   <button className='btn btn-primary w-full' type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                      <span className='loading loading-spinner loading-xs'></span>
                      Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className='text-center mt-4'>
                    <p className="text-sm">
                      Don't have an account{" "}
                      <Link to="/signup" className='text-primary hover:underline'>
                       Create one
                      </Link>
                    </p>
                  </div>
              </div>
            </div>
            </form>
            </div>
          </div>

          
          {/* LOGIN FROM RIGHT SIDE*/}
          <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
             <div className='max-w-md p-8'>
               {/* ILLUSTRATION*/}
               <div className="relative aspect-square max-w-sm mxauto">
                <img src="/i.png" alt="language connection illustration" className='w-full h-full' />
               </div>

               <div className="text-center space-y-3 mt-6">
                <h2 className="text-xl font-semibold">Connect with Language partners worlwide</h2>
                <p className="opacity-70">
                  Pratice conversation, make friends, and improve your language skills together
                </p>
               </div>
             </div>
          </div>
          </div>    
      </div>
  )
};

export default LoginPage
