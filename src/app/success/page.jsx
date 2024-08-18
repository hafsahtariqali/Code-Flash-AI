"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; 
import { useUser } from "@clerk/nextjs";

const Success = () => {
  const router = useRouter();
  const { user } = useUser();


    const handleRedirect = () => {
        router.push('/dashboard');
    };


  useEffect(() => {
    // if (!router.query?.session_id || !user) {
    //   console.log('Missing router.query.session_id or user');
    //   return;
    // }

    const updateSubscription = async () => {
      try {

        const userEmail = user.primaryEmailAddress?.emailAddress || user.primaryEmailAddress; 
        console.log("User Email: " + userEmail);
        
        const userDocRef = doc(db, 'Users', userEmail);

        await updateDoc(userDocRef, {
          subscription: "Pro"
        });

        console.log('Subscription updated successfully');
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    };

    updateSubscription();
  }, [router.query, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-extrabold mb-4">Subscription Successful</h1>
        <p className="text-lg mb-8">Your subscription has been successfully processed.</p>
        <button
        onClick={handleRedirect}
           
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
            Go to Dashboard
        </button>
    </div>
</div>
  );
};

export default Success;
