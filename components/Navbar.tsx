'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';


export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth');
      const data = await res.json();
      setUser(data.user);
    }

    fetchUser();
  }, []);

  return (
    <header className="font-montserrat fixed top-8 left-0 right-0 z-50 mx-auto max-w-xl px-6 py-2 bg-blue-50 ring-1 ring-gray-300 rounded-full shadow-lg backdrop-blur-lg">
    <div className="flex items-center justify-between">
      {/* Left Side: Logo and Voxa Button */}
      <div className="flex items-center gap-4 ">
        <Link href="/" className="flex items-center gap-2">
          <Image src="./logo.svg" alt="logo" width={35} height={24} className='shadow-2xl shadow-black bg-transparent rounded-2xl' />
          <button className="text-xl font-bold text-black">Voxa</button>
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <nav className="flex justify-between items-center gap-8 ">
        <Link href="/pricing" className="text-gray-500 font-semibold py-2 px-3 hover:bg-gray-200 hover:rounded-full transition-all ease-in-out duration-300">
          Pricing
        </Link>
        <Link href="/features" className="text-gray-500 font-semibold py-2 px-3 hover:bg-gray-200 hover:rounded-full transition-all duration-300 ease-in-out">
          Features
        </Link>
        <Link href="/faq" className="text-gray-500 font-semibold py-2 px-3 hover:bg-gray-200 hover:rounded-full transition-all duration-300 ease-in-out">
          FAQ
        </Link>
      </nav>

      {/* Right Side: User or Dashboard Link */}
      <div className="flex items-center gap-6 ">
        {user ? (
          <>
            <Link href="" className="text-primary font-medium">
              Dashboard
            </Link>
            
          </>
        ) : (
          <Link href="/login" className=" bg-none focus:bg-blue-500 rounded-full ring-1 ring-gray-200 text-gray-950 font-semibold hover:ring-gray-300 hover:bg-gray-200 px-4 py-2 transition-all duration-500 ease-in-out">
            Sign Up
          </Link>
        )}
      </div>
      </div>
    </header>
  );
}
