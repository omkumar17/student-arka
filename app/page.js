"use client";
import React from 'react'
// import Dashboard from './components/Dashboard'
import DashboardChild from './components/DashboardChild'
import Link from 'next/link';

const page = () => {
  return (
    <div >

      <div className="container mx-auto my-10">
        <div className=" w-full p-6  border border-gray-200 rounded-lg shadow  dark:border-gray-700 text-center">
          <Link href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Login To access other features</h5>
          </Link>
          <Link href="./Login" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center  bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white">
            Click To Login
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </Link>
        </div>
        
      </div>
      <DashboardChild />
    </div>
  )
}

export default page
