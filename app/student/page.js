"use client";
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const Page = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      <div>
        This is the student page
      </div>
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </>
  );
}

export default Page;
