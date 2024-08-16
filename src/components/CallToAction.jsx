"use client";

import React, { useState } from 'react';
import Link from 'next/link'; 


export const CallToAction = () => {
  return (
    <div id='cta' className="bg-gradient-to-b from-[#5D2CA8] to-black text-white py-20">
      <div className="container mx-auto text-center px-4 relative">
        <h2 className="font-bold text-6xl sm:text-7xl tracking-tight mb-6">
          Elevate your <br /> Coding Skills Now!
        </h2>
        <p className="text-center text-xl mt-8 py-10 px-5">
          Join thousands of learners who are mastering new programming languages every day. <br />
          Unlock your full potential with personalized study plans and advanced learning techniques.
        </p>
        <div className="flex justify-center mt-2">
        <Link href="/sign-in" className='bg-white text-black py-3 px-5 rounded-lg font-medium hover:bg-gray-100 hover:scale-105 transition duration-300 ease-in-out'> {/* Use Link component for navigation */}
              Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};
