"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const LoginOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [systemOtp, setSystemOtp] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for button
  const [userType] = useState("student");
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
    setLoading(true); // Set loading to true when starting OTP process

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_IP}/StudentLoginOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType, otp, systemOtp }),
      });

      if (res.status === 200) {
        const generatedOtp = generateOTP();
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              subject: 'OTP for Login to your account',
              text: `Hello,\n\nBelow is your OTP to Login to your account:\n${generatedOtp}\n\nDo not share this with anyone.`,
            }),
          });

          const data = await response.json();
          if (response.status === 200) {
            setSystemOtp(generatedOtp);
            toast.success("OTP sent successfully", {
              style: { fontWeight: "900", color: "black" },
            });
          } else {
            toast.error("Error sending OTP", {
              style: { fontWeight: "900", color: "black" },
            });
          }

        } catch (error) {
          toast.error("An error occurred while sending OTP", { style: { fontWeight: '900', color: 'black' } });
        }

      } else if (res.status === 201) {
        toast.success("OTP verified", {
          style: { fontWeight: "900", color: "black" },
        });

        try {
          const resData = await res.json();
          const result = await signIn("otp", {
            redirect: false,
            enrollment: resData.enrollment,
            email2: resData.email,
            userType2: resData.userType,
            firstName2: resData.name,
          });

          if (result.ok) {
            toast.success("You are now logged in", {
              style: { fontWeight: "900", color: "black" },
            });
            setTimeout(() => {
              router.push("/student");
            }, 3000);
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
    } finally {
      setLoading(false); // Set loading to false after OTP process completes
    }

    setOtp("");
  };

  return (
    <>
      <div className='container mx-auto w-[100vw] flex justify-center items-center h-[100vh]'>
        <ToastContainer />

        <div className="container h-[90vh] max-w-lg bg-white mx-auto md:pt-10 pt-0 p-10 flex flex-col justify-center items-center gap-5 md:gap-7 md:border-2 border-black rounded-3xl">
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
            <h1 className="text-3xl text-black">Login with OTP</h1>
          </div>
          <div className="form w-full">
            <form ref={formRef} onSubmit={handleSubmit} className='w-full flex flex-col justify-center items-center gap-7 md:gap-7'>
              <div className="email-input w-full">
                <input
                  type="email"
                  className="email w-full p-4 rounded-3xl text-black placeholder:text-black placeholder:opacity-70 border-[1px] border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
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
                    className="otp w-full p-4 rounded-3xl text-black placeholder:text-black placeholder:opacity-70 border-[1px] border-gray-700 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-[0_0_0_4px] focus:shadow-yellow-400"
                    placeholder='Enter your OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="submitBtn w-full">
                <button
                  type="submit"
                  className="submit bg-slate-800 text-white w-full p-4 rounded-3xl"
                  disabled={loading} // Disable button when loading
                >
                  {loading ? 'Sending OTP...' : !systemOtp ? 'Get OTP' : 'Verify OTP'}
                </button>
              </div>
              <div className="direct w-full">
                <Link href={"/Login"}>
                  <h4 className="credLog text-black">Sign in using Enrollment</h4>
                </Link>
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
    </>
  );
};

export default LoginOtp;
