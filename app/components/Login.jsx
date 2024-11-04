"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType] = useState('student');
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const formRef = useRef();
    const router = useRouter();
    
    const handleShow = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("enrollment", {
                redirect: false,
                username,
                password,
                userType,
            });

            if (result.ok) {
                toast.success("You are now logged in", {
                    style: { fontWeight: '900', color: 'black' },
                });
                setTimeout(() => {
                    router.push(`/student`);
                }, 3000);
            } else {
                toast.error("Login Failed", {
                    style: { fontWeight: '900', color: 'black' },
                });
            }
        } catch (error) {
            toast.error("Login Failed", {
                style: { fontWeight: '900', color: 'black' },
            });
        }

        setLoading(false);
        setUsername("");
        setPassword("");
        formRef.current.reset();
    };

    return (
        <div className='container mx-auto w-[100vw] flex justify-center items-center h-[100vh]'>
            <ToastContainer />
            <div className="container h-[90vh] max-w-lg bg-white  mx-auto pt-0  md:pt-10 p-10 flex flex-col justify-center items-center md:border-2 gap-5 md:gap-5 md:border-black rounded-3xl">
                <div className="logo">
                    <Image
                        src='/img/jgi.png'
                        alt="Arka Logo"
                        className="logo"
                        width={60}
                        height={60}
                    />
                </div>
                <div className="locationLogo cover md:h-20 w-20 bg-center">
                    <video
                        src='/img/location.mp4'
                        alt="Arka Logo"
                        className="logo rounded-full"
                        width={80}
                        height={80}
                        autoPlay
                        loop
                        muted
                    />
                </div>
                <div className="heading">
                    <h1 className="head text-3xl text-black">Arka Bus Tracking</h1>
                </div>
                <div className="form w-full">
                    <form ref={formRef} onSubmit={handleSubmit} className='w-full flex flex-col justify-center items-center gap-5 md:gap-5'>
                        <div className="first-input w-full relative">
                            <input
                                type="text"
                                className="username w-full p-4 text-black rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                placeholder='Enrollment'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <Image
                                src='/img/circle-user-round.png'
                                alt="userlogo"
                                className="show absolute right-4 top-4 cursor-pointer"
                                width={24}
                                height={24}
                            />
                        </div>
                        <div className="sec-input w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="password w-full p-4 text-black rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <Image
                                src={showPassword ? '/img/eye-off.png' : '/img/eye.png'}
                                onClick={handleShow}
                                alt="Show password"
                                className="show absolute right-4 top-4 cursor-pointer"
                                width={24}
                                height={24}
                            />
                        </div>
                        <div className="submitBtn w-full">
                            <button
                                type="submit"
                                className="submit bg-slate-800 text-white w-full p-4 rounded-3xl"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                        <div className="forgetPass w-full text-black flex flex-row justify-between">
                            <Link href="/security/forgotPassword">Forgot Password?</Link>
                            <Link href="/otplogin">Sign in using OTP</Link>
                        </div>
                        <div className="gif">
                            <video
                                src='/img/gifbus.mp4'
                                alt="gif-bottom"
                                className="git-btm"
                                width={200}
                                height={200}
                                autoPlay
                                loop
                                muted
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
