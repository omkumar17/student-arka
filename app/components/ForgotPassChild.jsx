import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// Import your images
// Adjust the path as needed
import eyeIcon from '/public/img/eye-off.png'; // Adjust the path as needed
import eyeOffIcon from '/public/img/eye.png'; // Adjust the path as needed

const ForgotPassChild = () => {
    const [step, setStep] = useState(1); // Step 1: Email & OTP, Step 2: Verify OTP, Step 3: Change Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [userOtp, setUserOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const formRef = useRef();
    const router = useRouter();

    // New state variables for password visibility
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Function to generate a 6-digit OTP
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Function to send OTP to user's email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const generatedOtp = generateOtp(); // Generate a 6-digit OTP
        setOtp(generatedOtp); // Store OTP for further verification

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject: 'OTP for changing your password',
                    text: `Hello ${session?.user?.firstName},\n\nBelow is your OTP to change your password:\n${generatedOtp}\n\nDo not share this with anyone.`,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("OTP sent to your email", { style: { fontWeight: '900', color: 'black' } });
                setIsOtpSent(true);
                setStep(2); // Move to OTP verification step
            } else {
                toast.error(data.message || "Failed to send OTP", { style: { fontWeight: '900', color: 'black' } });
            }
        } catch (error) {
            toast.error("An error occurred while sending OTP", { style: { fontWeight: '900', color: 'black' } });
        }
        setLoading(false);
    };

    // Function to verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (otp === userOtp) {
                toast.success("OTP verified. You can now change your password", { style: { fontWeight: '900', color: 'black' } });
                setStep(3); // Move to password reset step
            } else {
                toast.error("Invalid OTP", { style: { fontWeight: '900', color: 'black' } });
            }
        } catch (error) {
            toast.error("An error occurred while verifying OTP", { style: { fontWeight: '900', color: 'black' } });
        }
        setLoading(false);
    };

    // Function to change password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match", { style: { fontWeight: '900', color: 'black' } });
            setLoading(false);
            return;
        }

        try {
            const forgot = true;
            const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/api/changepassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword, forgot }),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("Password changed successfully", { style: { fontWeight: '900', color: 'black' } });
                setTimeout(() => router.push(`/Login`), 3000);
            } else {
                toast.error(data.message || "Password change failed", { style: { fontWeight: '900', color: 'black' } });
            }
        } catch (error) {
            toast.error("An error occurred while changing the password", { style: { fontWeight: '900', color: 'black' } });
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto w-[100vw] flex justify-center items-center h-[100vh]">
            <ToastContainer />
            <div className="container h-[90vh] max-w-lg bg-white mx-auto p-10 flex flex-col justify-center items-center md:border-2 gap-5 md:border-black rounded-3xl">
                <h1 className="text-3xl text-black">Forgot Password</h1>
                <form ref={formRef} onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleChangePassword} className="w-full flex flex-col gap-5">
                    {step === 1 && (
                        <div className="w-full flex flex-col gap-4">
                            <input
                                type="email"
                                className="w-full p-4 rounded-3xl text-black placeholder:text-black border-2 border-gray-700"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <button type="submit" className="bg-slate-800 text-white w-full p-4 rounded-3xl" disabled={loading}>
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="w-full flex flex-col gap-4">
                            <input
                                type="text"
                                className="w-full p-4 rounded-3xl placeholder:text-black text-black border-2 border-gray-700"
                                placeholder="Enter OTP"
                                value={userOtp}
                                onChange={(e) => setUserOtp(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <button type="submit" className="bg-slate-800 text-white w-full p-4 rounded-3xl" disabled={loading}>
                                {loading ? "Verifying OTP..." : "Verify OTP"}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <>
                            <div className="w-full flex flex-col gap-4">
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        className="w-full p-4 rounded-3xl placeholder:text-black text-black border-2 border-gray-700 my-4"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-8 text-gray-600"
                                    >
                                        <Image src={showNewPassword ? eyeIcon : eyeOffIcon} width={24} height={24} alt={showNewPassword ? 'Hide' : 'Show'} />
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="w-full p-4 rounded-3xl placeholder:text-black text-black border-2 border-gray-700"
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-5 text-gray-600"
                                    >
                                        <Image src={showConfirmPassword ? eyeIcon : eyeOffIcon} width={24} height={24} alt={showConfirmPassword ? 'Hide' : 'Show'} />
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="bg-slate-800 text-white w-full p-4 rounded-3xl" disabled={loading}>
                                {loading ? "Changing Password..." : "Change Password"}
                            </button>
                        </>
                    )}
                </form>
                <div className="flex gap-4 mt-2">
                    <Link href="/Login" className="text-sm text-slate-800">Go to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassChild;
