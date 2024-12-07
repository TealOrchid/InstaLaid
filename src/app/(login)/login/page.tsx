'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { FormEvent, useEffect } from 'react';
import Image from "next/image";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn('google', {
      callbackUrl: '/',
    });
    if (result?.ok) {
      router.push('/');
    } else {
      console.error('Error during sign-in');
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-green-300 via-yellow-400 to-pink-500 animate-gradient-x flex items-center justify-center p-4"
      style={{ fontFamily: "'Comic Sans MS', cursive" }}
    >
      <div
        className="bg-lime-400 p-6 md:p-8 border-4 border-purple-700 w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-[30px] md:rounded-[50px] shadow-2xl transform rotate-0 md:rotate-6 lg:rotate-12"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-red-600 underline font-extrabold tracking-widest text-left mb-4 md:mb-6">
          Welcome to InstaLaid
        </h1>
        <p className="text-blue-900 text-sm md:text-base lg:text-lg italic font-mono mb-4">
          Click below to login with Google:
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            className="bg-pink-600 hover:bg-green-500 text-black font-bold px-8 py-3 md:px-12 md:py-4 border-dotted border-4 border-red-800 rounded-full transition-transform transform hover:scale-110"
            type="submit"
          >
            Login with Google
          </button>
          <Image
            src={'/icon.ico'}
            alt="A pointless image"
            className="rotate-45 opacity-80"
            width={96}
            height={96}
            style={{
              aspectRatio: 'initial',
            }}
            priority
          />
        </form>
      </div>
    </div>
  );
}
