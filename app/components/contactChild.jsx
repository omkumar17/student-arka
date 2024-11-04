"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ContactChild = () => {
  const [contacts, setContacts] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const { data: session } = useSession();

  // Retrieve enrollment information from session
  useEffect(() => {
    if (session) {
      setEnrollment(session.user.enrollment);
    }
  }, [session]);

  // Fetch contacts from the API based on enrollment
  useEffect(() => {
    const fetchContacts = async () => {
      if (enrollment) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/api/contacts`);
          const data = await response.json();
          setContacts(data);
          console.log("Fetched contacts:", data);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      }
    };

    fetchContacts();
  }, [enrollment]);

  return (
    <div className="p-4 h-[90vh] container mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center ">Emergency Contacts</h1>

      {/* Contacts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full shadow-md rounded-lg border-4">
          <thead>
            <tr className="border-4">
              <th className="py-3 px-5 text-left font-semibold ">Name</th>
              <th className="py-3 px-5 text-left font-semibold ">Designation</th>
              <th className="py-3 px-5 text-left font-semibold ">Contact</th>
            </tr>
          </thead>
          <tbody> 
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr key={index} className="border-4  ">
                  <td className="py-3 px-5 ">{contact.name}</td>
                  <td className="py-3 px-5 ">{contact.designation}</td>
                  <td className="py-3 px-5 text-blue-600 dark:text-blue-400">
                    <a href={`tel:${contact.contact}`} className="hover:underline">
                      {contact.contact}
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-3 px-5 text-center ">
                  No contacts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactChild;
