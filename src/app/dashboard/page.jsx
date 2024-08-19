'use client';
import Flashcard from "@/components/flashcard";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import Snackbar from "@/components/Snackbar"; // Make sure the path is correct

const PRO_EMAILS = new Set([
    'hassansiddiqui740@gmail.com',
    'jenongrab@gmail.com',
    'isdm908@gmail.com',
    'ahmadbu648@gmail.com',
    'samarthx04@gmail.com',
    'rasheedabdullah317@gmail.com',
    'dcvivian36@gmail.com',
    'sajjadabdullah147@gmail.com',
    'manalz1619@gmail.com',
    'pianostars04@gmail.com',
    'shahrozjkl@gmail.com',
    'brisprats@gmail.com',
    'chaudharyshabbir246@gmail.com',
    'rahatshahid750@gmail.com',
    'ridaabid767@gmail.com',
    'logicalbakwas@gmail.com',
    'wordsofahmad@gmail.com',
    'muazaziz23@gmail.com',
    'kaneezayesha808@gmail.com',
    'maheenasad19@gmail.com',
    'Luciann.misc@gmail.com',
    'yasmineh2006@gmail.com',
    'aliroohan321@gmail.com',
    'oneplayer605@gmail.com',
    'maxyclassic197@mailfast.pro',
    'workemail.microsoft@gmail.com',
    'ehsanellahi1075@gmail.com',
    'hirraict369@gmail.com',
    'zainabtariqali77@gmail.com',
    'narmin4@yahoo.com',
    'abdullahkoraal@gmail.com',
    'sbahatshahid07@gmail.com',
    'salmanahmadyt@gmail.com',
    'marhabaemaan@gmail.com',
    'umerabbasi2003@gmail.com',
    'umerabbasi3002@gmail.com',
    'duaaaabrar@gmail.com',
    'hamzaafzal.official@gmail.com',
    'syetaha@gmail.com',
    'ayeshamunawar1000@gmail.com',
    'm.abubakrshahid787@gmail.com',
    'ayemish123@gmail.com',
    'samriddhimatharu1@gmail.com',
    'k213929@nu.edu.pk',
    'abbasiumer979@gmail.com'
]);

const Dashboard = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [message, setMessage] = useState('Generate Flashcards with CodeFlash');
    const [data, setData] = useState('');
    const [difficulty, setDifficulty] = useState(5);
    const [plan, setPlan] = useState("Free");
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setIsSaved] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { user, isLoaded } = useUser();

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;

    const handleUserData = async (user) => {
        try {
            const userEmail = user.primaryEmailAddress?.emailAddress || user.primaryEmailAddress;
            console.log("User Email: " + userEmail);

            const userDocRef = doc(db, 'Users', userEmail);
            const userDocSnapshot = await getDoc(userDocRef);

            const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;

            if (!userDocSnapshot.exists()) {
                await setDoc(userDocRef, {
                    email: userEmail,
                    savedCards: [],
                    subscription: PRO_EMAILS.has(userEmail) ? 'Pro' : 'Free',
                    subscriptionDate: formattedDate
                });

                console.log('User data stored successfully');
                setPlan(PRO_EMAILS.has(userEmail) ? 'Pro' : 'Free');
            
            } else {
                const userData = userDocSnapshot.data();
                const subscriptionDate = new Date(userData.subscriptionDate);
                const timeDifference = currentDate - subscriptionDate;

                if (timeDifference > oneMonthInMillis && userData.subscription === 'Pro') {
                    await updateDoc(userDocRef, {
                        subscription: 'Free',
                        subscriptionDate: formattedDate
                    });

                    setSnackbarMessage('Your Pro subscription has expired. You have been downgraded to Free.');
                    setSnackbarVisible(true);
                    setPlan('Free');
                } else {
                    setPlan(userData.subscription || 'Free');
                }

                const savedCards = userData.savedCards || [];
                setFlashcards(savedCards);
                setIsSaved(true);
                setDifficulty(userData.subscription === 'Pro' ? 10 : 5);
                console.log('User data retrieved:', userData);
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
            setMessage('Generate Flashcards with CodeFlash');
        } else {
            setMessage('');
        }
    }, [flashcards]);

    const generate = async (e) => {
        e.preventDefault();
        setFlashcards([]);
        setIsSaved(false);
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
            console.log('Flashcards received:', result);
            setFlashcards(result);
            setQuestion(data);
            setData('');
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
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
            e.preventDefault();
            document.getElementById('submit-btn').click();
        }
    };

    return (
        <div className={`relative min-h-screen transition-background ${plan === 'Pro' ? 'bg-custom-gradient' : 'bg-hero-gradient'}`}>
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
                                <form onSubmit={generate} className="w-full flex max-w-4xl items-center gap-2">
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
                                        className="flex-none rounded-md bg-purple-500 px-4 py-2 text-black hover:bg-purple-600"
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
                <p className="text-white">Please sign in to access this feature.</p>
            </SignedOut>
            {snackbarVisible && (
                <Snackbar message={snackbarMessage} onClose={() => setSnackbarVisible(false)} />
            )}
        </div>
    );
};

export default Dashboard;
