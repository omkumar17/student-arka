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
    const [loading, setLoading] = useState(false); // Loading state added
    const { data: session } = useSession();
    const formRef = useRef();
    const router = useRouter();
    
    const handleShow = () => {
        setShowPassword(!showPassword);
    };
    
    console.log(session);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when form is submitted

        try {
            const result = await signIn("enrollment", {
                redirect: false,
                username,
                password,
                userType,
            });

            console.log("result", result);

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
                console.log(result);
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error('Error:', error);
        }

        setLoading(false); // Reset loading to false when process is complete
        setUsername("");
        setPassword("");
        formRef.current.reset();
    };

    return (
        <div className='container mx-auto w-[100vw] flex justify-center items-center h-[100vh]'>
            <ToastContainer />
            <div className="container h-[100vh] md:h-[90vh] max-w-lg bg-white mx-auto p-10 flex flex-col justify-center items-center gap-10 md:gap-7 border-2 border-black rounded-3xl">
                <div className="logo">
                    <Image
                        src=''
                        alt="Arka Logo"
                        className="logo"
                        width={34}
                        height={34}
                    />
                </div>
                <div className="locationLogo">
                    <Image
                        src=''
                        alt="Arka Logo"
                        className="logo"
                        width={24}
                        height={24}
                    />
                </div>
                <div className="heading">
                    <h1 className="head text-3xl">Arka Bus Tracking</h1>
                </div>
                <div className="form w-full">
                    <form ref={formRef} onSubmit={handleSubmit} className='w-full flex flex-col justify-center items-center gap-10 md:gap-7'>
                        <div className="first-input w-full relative">
                            <input
                                type="text"
                                className="username w-full p-4 rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                placeholder='Username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading} // Disable input when loading
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
                                className="password w-full p-4 rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading} // Disable input when loading
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
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? "Logging in..." : "Login"} {/* Show loading text */}
                            </button>
                        </div>
                        <div className="forgetPass w-full text-black flex flex-row justify-between">
                            <Link href="#">Forgot Password?</Link>
                            <Link href="/otplogin">Sign in using OTP</Link>
                        </div>
                        <div className="gif">
                            <Image
                                src='/path-to-your-gif.gif'
                                alt="gif-bottom"
                                className="git-btm"
                                width={50}
                                height={50}
                                unoptimized
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
