import localFont from "next/font/local";
import "../globals.css";

import SessionWrapper from "../components/SessionWrapper";


const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
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

            <body

                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
            >


                {children}
            </body>

        </SessionWrapper>


    );
}
