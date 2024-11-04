"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userMenuRef = useRef(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeDropdowns = (event) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setIsUserMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdowns);
    return () => {
      document.removeEventListener('mousedown', closeDropdowns);
    };
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  if (status === 'authenticated') {
    return (
      <header className="navbar antialiased w-full fixed z-40 border-b-4 dark:bg-slate-800 bg-white dark:border-white border-black">
        <nav className=" bg-opacity-15 border-gray-200 ">
          <div className="max-w-screen-xl flex flex-wrap items-center py-3 justify-between mx-auto">
            <Link href="/" className='order-2 md:order-1'>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="self-center text-2xl font-semibold whitespace-nowrap md:ml-0 ">Arka BRT</span>
              </div>
            </Link>
            <div className="relative flex items-center gap-3 order-3 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                onClick={toggleDarkMode}
                className="p-2  rounded-full"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              <button
                type="button"
                onClick={toggleUserMenu}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded={isUserMenuOpen}
              >
                <span className="sr-only">Open user menu</span>
                <Image className="w-8 h-8 rounded-full" src="/images/profile-picture.jpg" alt="User photo" width={32} height={32} />
              </button>

              {isUserMenuOpen && (
                <div ref={userMenuRef} className="z-50 absolute top-10 right-0 mt-2 w-48 bg-white divide-y border-2 dark:divide-gray-100 divide-gray-400 rounded-lg shadow dark:bg-gray-700">
                  <div className="px-4 py-3">
                    <span className="block text-sm   capitalize">{session?.user?.firstName}</span>
                    <span className="block text-sm  truncate ">{session?.user?.email}</span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link href="#">
                        <div className="block px-4 py-2 text-sm ">Profile</div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/security/changePassword">
                        <div className="block px-4 py-2 text-sm ">Change Password</div>
                      </Link>
                    </li>
                    <li>
                      <div onClick={() => signOut()} className="block px-4 py-2 text-sm  cursor-pointer">
                        Sign out
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="relative md:order-2 pl-3">
              <button
                onClick={toggleNav}
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded={isNavOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
              <div className={`${isNavOpen ? "absolute left-0 md:top-0 top-14 md:border-0 border-b-4 block bg-white text-black dark:bg-black dark:text-white" : "hidden"} md:relative w-[100vw] items-center justify-between md:flex md:w-auto md:order-1`} id="navbar-user">
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-3 border border-gray-100  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:border-gray-700">
                  <li>
                    <Link href="/student">
                      <div className={`block py-2 px-3 ${pathname === '/student' ? 'text-blue-700' : ' '} hover:bg-gray-100 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500`}>
                        Home
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/fee">
                      <div className={`block py-2 px-3 ${pathname === '/student/fee' ? 'text-blue-700' : ' '} hover:bg-gray-100 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500`}>
                        Bus Fee
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/logs">
                      <div className={`block py-2 px-3 ${pathname === '/student/logs' ? 'text-blue-700' : ' '} hover:bg-gray-100 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500`}>
                        Logs
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/contacts">
                      <div className={`block py-2 px-3 ${pathname === '/student/contacts' ? 'text-blue-700' : ' '} hover:bg-gray-100 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500`}>
                        Emergency Contacts
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/feedback">
                      <div className={`block py-2 px-3 ${pathname === '/student/feedback' ? 'text-blue-700' : ' '} hover:bg-gray-100 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500`}>
                        Feedback
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/notice">
                      <div className={`block py-2 px-3 ${pathname === '/student/notice' ? 'text-blue-700' : ' '} hover:bg-gray-100 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500`}>
                        Notice
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return null;
};

export default Navbar;
