import localFont from "next/font/local";
import "../../globals.css";

import SessionWrapper from "../../components/SessionWrapper";

import { Suspense } from "react";
import Loading from "../../components/Loading";


const geistSans = localFont({
    src: "../../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "Login - BusArka",
    description: "Generated by create next app",
};

export default function Layout({ children }) {
    return (

        <SessionWrapper>
            
            <Suspense fallback={<Loading/>}>
            <main className='relative border-t-2 sm:border-t-0 h-[calc(100vh)] bg-white dark:bg-black'>
                {children}
            </main>
            </Suspense>

        </SessionWrapper>


    );
}