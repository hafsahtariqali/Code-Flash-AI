'use client'
import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { getDoc, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '@clerk/nextjs';

export const Snackbar = ({ message, visible }) => (
  <div className={`fixed bottom-20 right-4 bg-black text-white text-sm py-3 px-5 rounded shadow-lg transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
    {message}
  </div>
);


const Flashcard = ({ isOpened, question, answer, saved }) => {
  const [isFlipped, setIsFlipped] = useState(isOpened);
  const [isSaved, setIsSaved] = useState(saved); // Initialize with saved prop
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { user } = useUser();

  const handleToggle = (shouldToggle) => {
    if (shouldToggle) {
      setIsSaved(prev => !prev); // Toggle state if allowed
    }
  };

  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
  };

  const handleSaveButtonClick = async (e) => {
    e.stopPropagation();

    if (!user || !user.primaryEmailAddress) {
      console.error("User object is missing or emailAddress is undefined");
      return;
    }

    const userDocRef = doc(db, 'Users', user.primaryEmailAddress.emailAddress);
    
    try {
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const data = userDocSnapshot.data();
        if(data.subscription == 'Pro'){
        if (data.savedCards && data.savedCards.length >= 20) {
          setSnackbarVisible(true);
          setTimeout(() => setSnackbarVisible(false), 3000); // Hide after 3 seconds
          return; // Prevent further execution if limit is reached
        }}
        else{
          if (data.savedCards && data.savedCards.length >= 10) {
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 3000); // Hide after 3 seconds
            return; // Prevent further execution if limit is reached
          }
        }
      }

      // Toggle the save button state
      handleToggle(!isSaved);

      // Update saved cards
      const card = {
        front: question,
        back: answer,
      };

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
    <>
      <Snackbar 
        message="Your SavedCards storage is reached, try removing cards or upgrade your plan"
        visible={snackbarVisible}
      />
      <div className="relative m-2 w-80 h-80 perspective-1000">
        <div
          className={`relative w-full h-full cursor-pointer transition-transform duration-500 transform-style-preserve ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleCardClick}
        >
          <div className="absolute w-full h-full bg-white text-black border border-white flex items-center justify-center rounded-lg shadow-lg backface-hidden">
            <p className="text-center text-lg p-4">{question}</p>

            <button
              onClick={handleSaveButtonClick}
              className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors duration-300 
                ${isSaved ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}
                hover:bg-gray-300`}
              aria-label={isSaved ? 'Unsave' : 'Save'}
              disabled={snackbarVisible} // Disable button if snackbar is visible
            >
              <HeartIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute w-full h-full bg-hero-gradient border border-gray-700 text-white flex items-center justify-center rounded-lg shadow-lg rotate-y-180 backface-hidden">
            <p className="text-center text-lg p-4">{answer}</p>

            <button
              onClick={handleSaveButtonClick}
              className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors duration-300 
                ${isSaved ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}
                hover:bg-gray-300`}
              aria-label={isSaved ? 'Unsave' : 'Save'}
              disabled={snackbarVisible} // Disable button if snackbar is visible
            >
              <HeartIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Flashcard;
