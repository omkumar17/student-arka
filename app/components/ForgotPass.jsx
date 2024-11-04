"use client";

import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';

import { Suspense } from "react";
import Loading from './Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import ForgotPassChild from './ForgotPassChild';



const ForgotPass = () => {

    const router = useRouter();
   
   
        return (
            <Suspense fallback={<Loading/>}>
            <div>
                <ToastContainer/>
               <ForgotPassChild/>
            </div>
            </Suspense>
        )
    }
   


export default ForgotPass
