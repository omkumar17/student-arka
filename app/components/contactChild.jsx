"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ContactChild = () => {
  const [contacts, setContacts] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const { data: session } = useSession();
  
  // Get enrollment from session
  useEffect(() => {
    if (session) {
      setEnrollment(session.user.enrollment);
    }
  }, [session]);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      if (enrollment) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/api/contacts`);
          const data = await response.json();
          setContacts(data);
          console.log("data", data);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      }
    };

    fetchContacts();
  }, [enrollment]);

  return (
    <div className="p-4 h-[90vh] container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">Emergency Contacts</h1>

      {/* Contacts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="py-2 px-4 text-left text-black dark:text-white font-bold">Name</th>
              <th className="py-2 px-4 text-left text-black dark:text-white font-bold">Designation</th>
              <th className="py-2 px-4 text-left text-black dark:text-white font-bold">Contact</th>
            </tr>
          </thead>
          <tbody className="space-y-4">
            {contacts && contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <td className="py-2 px-4 text-black dark:text-white">{contact.name}</td>
                  <td className="py-2 px-4 text-black dark:text-white">{contact.designation}</td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    <a href={`tel:${contact.contact}`} className="text-blue-500 hover:underline">
                      {contact.contact}
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-2 px-4 text-center text-black dark:text-white">No contacts available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactChild;
