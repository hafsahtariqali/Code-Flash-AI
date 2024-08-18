"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from "../../firebase";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useUser } from "@clerk/nextjs";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const Pricings = () => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState(null); // Initialize as null for loading state
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const handlePlanLoad = async () => {
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress || user?.primaryEmailAddress;
        if (userEmail) {
          const userDocRef = doc(db, 'Users', userEmail);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();
          setSubscription(userData?.subscription || 'Free');
        } else {
          setSubscription('Free');
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscription('Free'); // Default to 'Free' on error
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    handlePlanLoad();
  }, [user]);

  const plans = [
    ...(!user ? [{
      name: "Free",
      price: "$0",
      features: [
        "Limited flashcards and storage access",
        "Basic support",
        "Basic personalization"
      ],
      buttonText: "Get started for Free",
      buttonVariant: "border border-white/30 text-white",
      textColor: "text-white",
      isPro: false,
      isEnterprise: false,
    }] : []),
    {
      name: "Pro",
      price: "$2",
      features: [
        "Secure more space for all your flashcards",
        "20 flashcards/prompt",
        "Custom study collections",
        "Priority Support",
      ],
      buttonText: "Go Pro",
      buttonVariant: "bg-black text-white",
      textColor: "text-black",
      isPro: true,
      isEnterprise: false,
    },
    ...(!user ? [{
      name: "Enterprise",
      price: "$-",
      features: [
        "Difficulty adjustment",
        "Custom limit flashcards",
        "Custom study plans",
      ],
      buttonText: "Customize your dashboard with Enterprise",
      buttonVariant: "bg-white text-black",
      textColor: "text-white",
      isPro: false,
      isEnterprise: true,
    }] : []),
  ];

  const handleButtonClick = (path) => {
    window.location.href = path;
  };

  const handleCheckout = async (plan, amount, currency, interval) => {
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan,
          amount: amount,
          currency: currency,
          interval: interval,
        }),
      });

      const session = await response.json();

      if (session.error) {
        console.error(session.error.message);
        return;
      }

      // Redirect to the payment URL
      window.location.href = session.url;

      const userDocRef = doc(db, 'Users', user.primaryEmailAddress.emailAddress);
      await updateDoc(userDocRef, {
        subscription: plan
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-black to-[#5D2CA8] text-white py-20">
        <div className="container text-center">
          <div className="mt-4">
            <div className="w-16 h-16 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id='pricings' className="bg-gradient-to-b from-black to-[#5D2CA8] text-white py-[20px] pb-20">
      {subscription === 'Free' ? (
        <div className="container">
          <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter pt-10 pb-20">Plans and Pricing</h2>
          <motion.div
            className="flex flex-col sm:flex-row gap-8"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                className={`border border-white/30 p-10 text-center rounded-xl sm:flex-1 ${plan.name === "Pro" ? "bg-white" : ""}`}
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className={`font-bold text-2xl mb-4 ${plan.textColor}`}>{plan.name}</h3>
                <p className={`text-3xl font-bold mb-6 ${plan.textColor}`}>{plan.price}</p>
                <ul className={`space-y-2 mb-6 ${plan.textColor}`}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={`${plan.name === "Pro" ? "text-gray-700" : "text-white/70"}`}>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.isPro && (
                  !user ?
                    <button
                      className={`mt-6 py-2 px-4 rounded-lg font-bold ${plan.buttonVariant}`}
                      onClick={() => handleButtonClick('/sign-in')}
                    >
                      {plan.buttonText}
                    </button> :
                    <button
                      className={`mt-6 py-2 px-4 rounded-lg font-bold ${plan.buttonVariant}`}
                      onClick={() => handleCheckout("Pro", 3, 'usd', 'month')}
                    >
                      {plan.buttonText}
                    </button>
                )}
                {plan.isEnterprise && (
                  <h2>Coming Soon</h2>
                )}
                {!plan.isPro && !plan.isEnterprise && (
                  <button className={`mt-6 py-2 px-4 rounded-lg font-bold ${plan.buttonVariant}`}
                    onClick={() => handleButtonClick('/sign-in')}
                  >
                    {plan.buttonText}
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className='container'>
          <h1 className='text-white text-center mt-4 text-4xl'>You are subscribed to {subscription} version</h1>
          <h6 className='text-white text-center mt-4'>You can change the subscription once this month is over</h6>
        </div>
      )}
    </div>
  );
};

export default Pricings;
