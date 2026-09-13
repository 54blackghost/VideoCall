
import React, { useState } from 'react'
import {  ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';
import { SignInButton } from "@clerk/react";

const LoginPage = () => {

  const [loginData, setLoginData] = useState({
      email: "",
      password: "",
    });
 
   const handleLogin = (e) => {
    e.preventDefault();
    SignInButton(loginData);
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
                  
 
                <p className="text-sm bg-center">──────── Or ────────</p>

                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="btn btn-outline w-full"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="#4285F4"
                          d="M21.35 12.23c0-.79-.07-1.55-.23-2.23H12v4.22h5.24a4.48 4.48 0 0 1-1.95 2.94v2.45h3.16c1.85-1.7 2.9-4.2 2.9-7.38z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 21.6c2.65 0 4.87-.88 6.49-2.39l-3.16-2.45c-.88.59-2 .94-3.33.94-2.56 0-4.73-1.73-5.51-4.06H3.22v2.53A9.8 9.8 0 0 0 12 21.6z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M6.49 13.64A5.9 5.9 0 0 1 6.18 12c0-.57.1-1.13.31-1.64V7.83H3.22A9.8 9.8 0 0 0 2.2 12c0 1.58.38 3.08 1.02 4.17l3.27-2.53z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 6.3c1.44 0 2.73.5 3.75 1.48l2.81-2.81C16.86 3.39 14.65 2.4 12 2.4a9.8 9.8 0 0 0-8.78 5.43l3.27 2.53C7.27 8.03 9.44 6.3 12 6.3z"
                        />
                      </svg>

                      Continuer avec Google
                    </button>
                  </SignInButton>

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
