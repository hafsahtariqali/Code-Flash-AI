'use client';
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';


// Ensure to call toast.configure() in your root component if not already
const CollectionModal = ({ isOpen, onClose, flashcards }) => {
    const [collectionName, setCollectionName] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const {user} = useUser()

    const handleSelectCard = (flashcard) => {
        setSelectedCards((prev) =>
            prev.includes(flashcard)
                ? prev.filter((item) => item !== flashcard)
                : [...prev, flashcard]
        );
    };

    const handleSaveCollection = async () => {
        console.log("clickedd")
        const userEmail = user.primaryEmailAddress?.emailAddress || user.primaryEmailAddress; 

        // if (!userEmail) return;

        setLoading(true);

        try {
            console.log(userEmail)
            const userDocRef = doc(db, 'Users', userEmail);

            // Retrieve existing user data
            const userDocSnapshot = await getDoc(userDocRef);
            var userData = {};

            if (userDocSnapshot.exists()) {
                userData = userDocSnapshot.data();
            }

            // Prepare collection data
            const collectionData = selectedCards.map(card => ({
                front: card.front,
                back: card.back
            }));

            // Save or update the collections field
            await updateDoc(userDocRef, {
                [`collections.${collectionName}`]: collectionData
            });

            // Notify user
            toast.success('Collection saved successfully!', {
                position: 'top-right'
            });

            // Close modal
            onClose();
        } catch (error) {
            console.error('Error saving collection: ', error);
            toast.error('Error saving collection!', {
                position: 'top-right'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Collection"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)' // Dark overlay background
                },
                content: {
                    color: 'white',
                    backgroundColor: '#1a1a1a', // Dark modal background
                    border: 'none',
                    borderRadius: '8px',
                    padding: '20px',
                    maxWidth: '600px',
                    margin: 'auto'
                }
            }}
        >
            <h2>Create Collection</h2>
            <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Collection Name"
                className="mb-6 mt-4 p-2 border-b-2 border-gray-500 text-white bg-gray-800"
            />
            <div className="flex flex-col mb-4">
                {flashcards.map((flashcard) => (
                    <div key={crypto.randomUUID()} className="flex items-center mb-2 border-b-2 border-gray-600 pb-2">
                        <div className="flex-grow text-gray-200">
                            <p>{flashcard.front}</p>
                            <p>{flashcard.back}</p>
                        </div>
                        <button
                            onClick={() => handleSelectCard(flashcard)}
                            className={`px-4 py-2 rounded-lg ${
                                selectedCards.includes(flashcard) ? 'bg-green-500 text-white' : 'bg-blue-500'
                            }`}
                        >
                            {selectedCards.includes(flashcard) ? '✓' : 'Add'}
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={()=>handleSaveCollection()}
                className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {loading ? 'Saving...' : 'Save Collection'}
            </button>
            <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
                Cancel
            </button>
        </ReactModal>
    );
};

export default CollectionModal;
