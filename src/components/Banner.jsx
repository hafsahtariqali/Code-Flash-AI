"use client"
import React, { useState } from 'react';
import Modal from './Waitlist'; // Adjust the import path as needed

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="py-3 text-center bg-custom-gradient">
      <div className="container">
        <a
          href="#"
          className="underline underline-offset-4 font-medium cursor-pointer"
          onClick={(e) => {
            e.preventDefault(); // Prevent default anchor link behavior
            handleOpenModal();
          }}
        >
          Join the waitlist!
        </a>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Banner;
