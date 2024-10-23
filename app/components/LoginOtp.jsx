"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginOtp = () => {
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [systemOtp, setSystemOtp] = useState("");
  const [userType] = useState("student"); // UserType is set directly here
  const { data: session } = useSession();
  const router = useRouter();
  const formRef = useRef();

  useEffect(() => {
    if (systemOtp) {
      console.log("Generated OTP:", systemOtp);
    }
  }, [systemOtp]);

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://bus-arka-server.vercel.app/StudentLoginOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType, otp, systemOtp }),
      });

      if (res.status === 200) {
        const generatedOtp = generateOTP();
        setSystemOtp(generatedOtp);

        toast.success("OTP sent successfully", {
          style: { fontWeight: "900", color: "black" },
        });
        console.log("OTP sent successfully");
      } else if (res.status === 201) {
        toast.success("OTP verified", {
          style: { fontWeight: "900", color: "black" },
        });

        try {
          const resData = await res.json();

          console.log("resData", resData);

          const result = await signIn("otp", {
            redirect: false,
            enrollment:resData.enrollment,
            email2: resData.email,
            userType2: resData.userType,
            firstName2: resData.name,
          });

          console.log("result", result);
          if (result.ok) {
            toast.success("You are now logged in", {
              style: { fontWeight: "900", color: "black" },
            });
            setTimeout(() => {
              router.push("/student");
            }, 3000);
            console.log("session",session);
          } else {
            toast.error("Login Failed", {
              style: { fontWeight: "900", color: "black" },
            });
          }
        } catch (err) {
          console.log("error", err.message);
        }

        setSystemOtp("");
       
        setEmail("");
        setOtp("");
        formRef.current.reset();
      } else if (res.status === 202) {
        toast.error("Invalid OTP", {
          style: { fontWeight: "900", color: "black" },
        });
        console.log("OTP denied");
      } else {
        toast.error(res.statusText);
        
        setEmail("");
        setOtp("");
        formRef.current.reset();
      }
    } catch (err) {
      console.log("error", err.message);
      
      setOtp("");
      setEmail("");
      setSystemOtp("");
      formRef.current.reset();
    }

    setOtp("");
  };

    return (
        <>
            <div className='container mx-auto w-[100vw] flex justify-center items-center h-[100vh]'>
                <ToastContainer />
                <div className="container h-[100vh] md:h-[90vh] max-w-lg bg-white mx-auto p-10 flex flex-col justify-center items-center gap-10 md:gap-7 border-2 border-black rounded-3xl">
                    <div className="heading">
                        <h1 className="text-3xl">Login with OTP</h1>
                    </div>
                    <div className="form w-full">
                        <form ref={formRef} onSubmit={handleSubmit} className='w-full flex flex-col justify-center items-center gap-10 md:gap-7'>
                            <div className="email-input w-full">
                                <input
                                    type="email"
                                    className="email w-full p-4 rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {systemOtp && (
                                <div className="otp-input w-full">
                                    <input
                                        type="text"
                                        minLength="6"
                                        maxLength="6"
                                        className="otp w-full p-4 rounded-3xl placeholder:text-black placeholder:opacity-70 border-[1px] border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                                        placeholder='Enter your OTP'
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="submitBtn w-full">
                                <button type="submit" className="submit bg-slate-800 text-white w-full p-4 rounded-3xl">
                                    {!systemOtp ? 'Get OTP' : 'Verify OTP'}
                                </button>
                            </div>
                            <div className="direct w-full">
                                <Link href={"/"}> 
                                <h4 className="credLog">Sign in using Enrollment</h4>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginOtp;
