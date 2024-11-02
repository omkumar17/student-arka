"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const NoticeChild = () => {
  const [notices, setNotices] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setEnrollment(session.user.enrollment);
    }
  }, [session]);

  useEffect(() => {
    const fetchNotices = async () => {
      if (enrollment) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/notice`); // Update API endpoint accordingly
          const data = await response.json();
          setNotices(data.notices);
          console.log("data", data);
        } catch (error) {
          console.error('Error fetching notices:', error);
        }
      }
    };

    fetchNotices();
  }, [enrollment]);

  useEffect(() => {
    console.log("notices", notices);
  }, [notices]);

  return (
    <div className='h-[calc(100vh-3.5rem)] overflow-y-scroll pb-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-700'>
      <h1 className="heading text-black dark:text-white text-2xl text-center mt-10 font-bold">Notices</h1>
      <h1 className="heading text-red-700 dark:text-red-600 text-lg  text-center mb-10 font-bold"> ( Please check the date for the notice )</h1>

      {/* Notices Section */}
      <div className="container mx-auto flex flex-col gap-5">
        {notices && notices.length > 0 ? (
          notices.map((notice, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border dark:border-gray-700">
              <div className="mb-4">
                <p className="text-black dark:text-white text-lg my-4 border-2 py-10 px-5 rounded-lg border-blue-600"> {notice.content}</p>
                <p className="text-black dark:text-white my-4 text-md"><strong className='bg-blue-600 p-2 rounded-lg'>Created At:</strong> {notice.createdAt}</p>
                <p className="text-black dark:text-white my-4 text-md"><strong className='bg-blue-600 p-2 rounded-lg'>Time:</strong> {notice.createdTime}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No notices available</p>
        )}
      </div>
    </div>
  );
};

export default NoticeChild;
