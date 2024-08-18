'use client';
import Flashcard from "@/components/flashcard";
import CollectionModal from "@/components/CollectionModal";
import { SignedIn, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

const SavedCards = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [plan, setPlan] = useState();
    const [message, setMessage] = useState('No saved items yet');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, isLoaded } = useUser();
    const [collectionNames, setCollectionNames] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('savedCards');
    
    const fetchSavedCards = async () => {
        const userEmail = user.primaryEmailAddress?.emailAddress || user.primaryEmailAddress; 
        try {
            console.log("User Email: " + userEmail);
            
            // Reference to the user's document
            const userDocRef = doc(db, 'Users', userEmail);

            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const savedCards = userData.savedCards || [];
                const collections = userData.collections || {};
                
                setPlan(userData.subscription);
                setFlashcards(savedCards); // Initially show saved cards
                setCollectionNames(Object.keys(collections));
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

    const handleFilterChange = async (event) => {
        const userEmail = user.primaryEmailAddress?.emailAddress || user.primaryEmailAddress; 
        const selectedValue = event.target.value;
        setSelectedFilter(selectedValue);
    
        try {
            const userDocRef = doc(db, 'Users', userEmail);
            const userDocSnapshot = await getDoc(userDocRef);
    
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                if (selectedValue === 'savedCards') {
                    setFlashcards(userData.savedCards || []);
                } else {
                    const collectionCards = userData.collections?.[selectedValue] || [];
                    setFlashcards(collectionCards);
                }
            }
        } catch (error) {
            console.error('Error retrieving user data: ', error);
        }
    };
    





    return (
        <div className="bg-hero-gradient relative min-h-screen bg-black p-4">
            <SignedIn>
                {user && plan === 'Pro' && (
                    <div className="top-4 right-4 flex flex-row">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='bg-white py-2 px-4 text-black rounded-lg shadow-lg'
                        >
                            Create a collection
                        </button>
                    <select 
                        value={selectedFilter} 
                        onChange={handleFilterChange} 
                        className="bg-white text-black p-2 rounded-lg ml-4"
                    >
                        <option value="savedCards">Saved Cards</option>
                        {collectionNames.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>


                    </div>
                )}

               

                <div className="flex flex-row items-center m-2 p-4 flex-wrap">
                    {flashcards.length === 0 ? (
                        <h1 className="flex items-center justify-center text-center h-screen text-4xl font-bold text-white">{message}</h1>
                    ) : (
                        flashcards.map((flashcard) => (
                            <Flashcard
                                key={crypto.randomUUID()}
                                isOpened={false}
                                question={flashcard.front}
                                answer={flashcard.back}
                                saved={true}
                            />
                        ))
                    )}
                </div>
            <CollectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                flashcards={flashcards}
                />
                </SignedIn>
        </div>
    );
};

export default SavedCards;
