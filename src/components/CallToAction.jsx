"use client";

import React, { useState } from 'react';
import Waitlist from './Waitlist'; // Adjust the import path as needed

export const CallToAction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
          <button
            className="bg-white text-black py-3 px-5 rounded-lg font-medium"
            onClick={handleOpenModal}
          >
            Join waitlist now!
          </button>
        </div>
        <p className="mt-8 text-white/60 text-sm">
          Join waitlist and get access to premium features for a month.
        </p>
      </div>

      <Waitlist isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};
