'use client';
import Flashcard from "@/components/flashcard";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

const SavedCards = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [message, setMessage] = useState('No saved items yet');
    const { user, isLoaded } = useUser(); // Clerk user hook

    const fetchSavedCards = async () => {
        try {
            const userEmail = user.primaryEmailAddress?.emailAddress || user.primaryEmailAddress; 
            console.log("User Email: " + userEmail);
            
            // Reference to the user's document
            const userDocRef = doc(db, 'Users', userEmail);

            // Fetch the document once
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const savedCards = userData.savedCards || []; // Default to an empty array if `savedCards` doesn't exist
                setFlashcards(savedCards); // Update state with data
                console.log('Saved cards retrieved and stored:', savedCards);
            } else {
                console.log('No user data found');
                setFlashcards([]); // Clear flashcards if no data found
            }
        } catch (error) {
            console.error('Error retrieving user data: ', error);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchSavedCards();
        }
    }, [isLoaded, user]);

    useEffect(() => {
        if (flashcards.length === 0) {
            setMessage('No saved items yet');
        } else {
            setMessage('');
        }
    }, [flashcards]);

    return (
        <div className="relative min-h-screen bg-black">
            <SignedIn>
                <div className="flex flex-row items-center m-2 p-4 flex-wrap transition-">
                    {flashcards.length === 0 ? (
                        <h1 className="flex items-center justify-center text-center h-screen text-4xl font-bold">{message}</h1>
                    ) : (
                        flashcards.map((flashcard) => (
                            <Flashcard
                                key={crypto.randomUUID()}
                                isOpened={false}
                                question={flashcard.front}
                                answer={flashcard.back}
                            />
                        ))
                    )}
                </div>
            </SignedIn>
        </div>
    );
};

export default SavedCards;
