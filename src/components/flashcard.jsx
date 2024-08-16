'use client'
import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '@clerk/nextjs';

const Flashcard = ({ isOpened, question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(isOpened);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useUser();

  // Toggle the save status
  const handleToggle = () => {
    setIsSaved(prev => !prev);
  };

  // Handle card flip
  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
  };

  const handleSaveButtonClick = async (e) => {
    e.stopPropagation();
    handleToggle();

    console.log(user); // Debugging user object
    if (!user || !user.primaryEmailAddress) {
      console.error("User object is missing or emailAddress is undefined");
      return;
    }

    const card = {
      front: question,
      back: answer,
    };

    try {
      // Using the email address as the document ID
      const userDocRef = doc(db, 'Users', user.primaryEmailAddress.emailAddress);

      await updateDoc(userDocRef, {
        savedCards: isSaved 
          ? arrayRemove(card) // Remove if saved
          : arrayUnion(card)  // Add if not saved
      });
    } catch (error) {
      console.error('Error updating saved cards: ', error);
    }
  };

  return (
    <div className="relative m-2 w-80 h-80 perspective-1000">
      {/* Flashcard */}
      <div
        className={`relative w-full h-full cursor-pointer transition-transform duration-500 transform-style-preserve ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={handleCardClick}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full bg-white text-black border border-white flex items-center justify-center rounded-lg shadow-lg backface-hidden">
          <p className="text-center text-lg p-4">{question}</p>

          <button
            onClick={handleSaveButtonClick}
            className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors duration-300 
              ${isSaved ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}
              hover:bg-gray-300`}
            aria-label={isSaved ? 'Unsave' : 'Save'}
          >
            <HeartIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full bg-hero-gradient border border-gray-700 text-white flex items-center justify-center rounded-lg shadow-lg rotate-y-180 backface-hidden">
          <p className="text-center text-lg p-4">{answer}</p>

          <button
            onClick={handleSaveButtonClick}
            className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors duration-300 
              ${isSaved ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}
              hover:bg-gray-300`}
            aria-label={isSaved ? 'Unsave' : 'Save'}
          >
            <HeartIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
