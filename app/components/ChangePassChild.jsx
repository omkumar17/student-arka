"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ChangePassChild = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {data:session}=useSession();
    const formRef = useRef();
    const router = useRouter();
    
    const handleShowPassword = (type) => {
        if (type === "current") setShowPassword(!showPassword);
        else if (type === "new") setShowNewPassword(!showNewPassword);
        else setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match", {
                style: { fontWeight: '900', color: 'black' },
            });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/api/changepassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: session?.user?.email,
                    oldPassword: currentPassword,
                    newPassword,
                    
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                toast.success("Password changed successfully", {
                    style: { fontWeight: '900', color: 'black' },
                });
                setTimeout(() => {
                    router.push(`/student`);
                }, 3000);
            } else {
                toast.error(data.message || "Password change failed", {
                    style: { fontWeight: '900', color: 'black' },
                });
            }
        } catch (error) {
            toast.error("An error occurred while changing the password", {
                style: { fontWeight: '900', color: 'black' },
            });
        }
        setLoading(false);
        formRef.current.reset();
    };

    return (
        <div className='container mx-auto w-[100vw] flex justify-center items-center h-[100vh]'>
            <ToastContainer />
            <div className="container h-[90vh] max-w-lg bg-white mx-auto pt-0 md:pt-10 p-10 flex flex-col justify-center items-center md:border-2 gap-5 md:gap-5 md:border-black rounded-3xl">
                <div className="heading">
                    <h1 className="head text-3xl text-black">Change Password</h1>
                </div>
                <div className="form w-full">
                    <form ref={formRef} onSubmit={handleSubmit} className='w-full flex flex-col justify-center items-center gap-5 md:gap-5'>
                        <div className="first-input w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="current-password w-full p-4 rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] text-black border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                placeholder='Current Password'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <Image
                                src={showPassword ? '/img/eye-off.png' : '/img/eye.png'}
                                onClick={() => handleShowPassword("current")}
                                alt="Show password"
                                className="show absolute right-4 top-4 cursor-pointer"
                                width={24}
                                height={24}
                            />
                        </div>
                        <div className="sec-input w-full relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="new-password w-full p-4 rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] text-black border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                placeholder='New Password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <Image
                                src={showNewPassword ? '/img/eye-off.png' : '/img/eye.png'}
                                onClick={() => handleShowPassword("new")}
                                alt="Show new password"
                                className="show absolute right-4 top-4 cursor-pointer"
                                width={24}
                                height={24}
                            />
                        </div>
                        <div className="confirm-input w-full relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="confirm-password w-full p-4 rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] text-black border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                placeholder='Confirm New Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <Image
                                src={showConfirmPassword ? '/img/eye-off.png' : '/img/eye.png'}
                                onClick={() => handleShowPassword("confirm")}
                                alt="Show confirm password"
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
                                {loading ? "Updating Password..." : "Change Password"}
                            </button>
                        </div>
                        <div className="back-to-profile w-full text-black flex justify-center">
                            <Link href="/student">Back to Profile</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassChild;
