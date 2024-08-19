'use client';
import Flashcard from "@/components/flashcard";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [message, setMessage] = useState('Generate Flashcards with your custom prompt and difficulty');
    const [data, setData] = useState('');
    const [difficulty, setDifficulty] = useState(5);
    const [plan, setPlan] = useState("Free");
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const { user, isLoaded } = useUser(); // Clerk user hook
    const [saved,setisSaved] = useState(false)

    const handleUserData = async (user) => {
        try {
            const userEmail = user.primaryEmailAddress?.emailAddress || user.primaryEmailAddress;
            console.log("User Email: " + userEmail);
    
            
            const userDocRef = doc(db, 'Users', userEmail);
            const userDocSnapshot = await getDoc(userDocRef);
    
            if (!userDocSnapshot.exists()) {
                // If the document does not exist, create it
                await setDoc(userDocRef, {
                    email: userEmail,
                    savedCards: [],
                    subscription: 'Free'
                });
    
                console.log('User data stored successfully');
                setPlan('Free'); 
            
            } else {
                const userData = userDocSnapshot.data();
                setPlan(userData.subscription)
                const savedCards = userData.savedCards || [];
                setFlashcards(savedCards);
                setisSaved(true)
                setPlan(userData.subscription || 'Free'); 
                userData.subscription=='Pro' ? setDifficulty(10): setDifficulty(5)
                console.log('User data retrieved:',     userData);
            }
        } catch (error) {
            console.error('Error handling user data: ', error);
        }
    };
    

    useEffect(() => {
        if (isLoaded && user) {
            handleUserData(user);
        }
    }, [isLoaded, user]);

    useEffect(() => {
        if (flashcards.length === 0) {
            setMessage('Generate Flashcards with your custom prompt and difficulty');
        } else {
            setMessage('');
        }
    }, [flashcards]);

    const generate = async (e) => {
        e.preventDefault();
        setFlashcards([]);
        setisSaved(false)
        setMessage('');
        setLoading(true); 
    
        if (data.trim() === '') {
            alert("Please enter some data to generate flashcards.");
            setLoading(false);
            return;
        }
    
        const formData = { data, difficulty, plan };
        console.log('Generating flashcards with formData:', formData); 
    
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                throw new Error("Error generating flashcards, check your plan or try contacting the admin");
            }
    
            const result = await response.json();
            console.log('Flashcards received:', result); // Log the result to check number of flashcards
            setFlashcards(result);
            setQuestion(data);
            setData('');
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    };
    

    const handleTextareaChange = (e) => {
        const textarea = e.target;
        setData(textarea.value);

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default Enter key action
          document.getElementById('submit-btn').click(); // Trigger button click
        }
      };

    return (
        <div className={`relative min-h-screen 
        ${plan=='Pro' ? 'bg-custom-gradient'  :'bg-hero-gradient'}`}>
            <SignedIn>
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-white"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-row items-center m-2 p-4 flex-wrap">
                            <h3>{question}</h3>
                        </div>
                        <div className="flex flex-row items-center m-2 p-4 flex-wrap transition-">
                            {flashcards.length === 0 ? (
                                 <div className="flex items-center justify-center h-screen">
                                    <h1 className="text-center text-4xl font-bold">{message}</h1>
                                </div>
                            ) : (
                                flashcards.map((flashcard) => (
                                    <Flashcard
                                        key={crypto.randomUUID()}
                                        isOpened={false}
                                        question={flashcard.front}
                                        answer={flashcard.back}
                                        saved={saved}
                                    />
                                ))
                            )}
                        </div>
                        <div className="fixed bottom-0 left-0 w-full p-4 flex items-center justify-center">
                            <div className="w-full flex max-w-4xl items-center gap-2">
                                <form onSubmit={generate} 
                                className="w-full flex max-w-4xl items-center gap-2">
                                    <textarea
                                        rows={1}
                                        value={data}
                                        onChange={handleTextareaChange}
                                        onKeyDown={handleKeyDown}
                                        required
                                        className="flex-grow rounded-md text-white border-2 border-gray-600 bg-black p-2"
                                        title="Prompt"
                                        placeholder="Enter your prompt here to generate flashcards"
                                        style={{ overflow: 'hidden', resize: 'none' }}
                                    />
                                    <button
                                        id="submit-btn"
                                        type="submit"
                                        className="bg-white text-black p-2 rounded-md"
                                    >
                                        Generate
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </SignedIn>

            <SignedOut>
                <h1 className="text-white text-center mt-4">Please Sign In to access the dashboard</h1>
            </SignedOut>
        </div>
    );
};

export default Dashboard;
