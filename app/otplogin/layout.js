import localFont from "next/font/local";
// import "../globals.css";

import SessionWrapper from "../components/SessionWrapper";



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
