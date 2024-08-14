"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import bulbImage from '../assets/images/lightbulb.png';
import checkImage from '../assets/images/checkmark.png';
import { motion } from 'framer-motion';
import Modal from '../components/Waitlist'; // Adjust the import path as needed

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div id='hero' className="bg-black text-white bg-hero-gradient py-[72px] sm:py-15 relative overflow-clip">
      <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[1200px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-radial-gradient top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
      <div className="container relative">
        <div className="flex justify-center mt-8">
          <div className="inline-flex relative">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter text-center inline-flex">
              Ace Coding <br />with Flashcards
            </h1>
            <motion.div
              className='absolute right-[485px] top-[140px] hidden sm:inline'
              drag
              dragSnapToOrigin
            >
              <Image src={checkImage} height={250} width={250} alt='' className='max-w-none' draggable='false' />
            </motion.div>
            <motion.div
              className='absolute top-[10px] left-[498px] hidden sm:inline'
              drag
              dragSnapToOrigin
            >
              <Image src={bulbImage} height={250} width={250} alt='' className='max-w-none' draggable='false' />
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center">
          <p className="text-center text-xl mt-8 py-10 max-w-lg">
            Transform your coding with CodeFlash—engaging flashcards for AI learners and CS students. Master new languages and concepts with active recall and avoid tutorial hell. Make learning interactive and fun!
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <button
            className="bg-white text-black py-3 px-5 rounded-lg font-medium hover:bg-gray-100 hover:scale-105 transition duration-300 ease-in-out"
            onClick={handleOpenModal}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Hero;
