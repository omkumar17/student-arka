"use client";

import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Suspense } from "react";
import Loading from './Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

import FeeChild from './FeeChild';

const Fee = () => {

    const router = useRouter();
    const { data: session, status } = useSession();
    console.log(session);
    useEffect(() => {
        if (status === 'loading') {
            // Do nothing while loading
            console.log("Authenticated");
            return;
        }
        
        else if (status === 'authenticated') {
            // User is authenticated
            console.log("Authenticated");
        } else if (status === 'unauthenticated') {
            // User is not authenticated, redirect to login
            console.log("Unauthenticated");
            // router.push('/Login/credentials');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return <Loading />; // Show loading while session status is still loading
    }
    // if (true) {
        if (session?.user?.userType === 'student' && status==='authenticated') {
        return (
            <Suspense fallback={<Loading/>}>
            <div>
                <ToastContainer/>
                <FeeChild/>
            </div>
            </Suspense>
        )
    }
    else{
        return (
            <div className='pl-20 text-black dark:text-white'>
                Access Denied please return to <Link href={'/Login'} className='text-blue-800 underline'>login page</Link>
            </div>
        )
    }
}

export default Fee
