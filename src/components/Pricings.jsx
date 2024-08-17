"use client"
import React from 'react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "For single person",
      "Limited flashcards",
      "Basic support",
      "Basic personalization"
    ],
    buttonText: "Get started for Free",
    buttonVariant: "border border-white/30 text-white",
    textColor: "text-white",
  },
  {
    name: "Pro",
    price: "$5",
    features: [
      "For single person + guest",
      "Unlimited flashcards",
      "Custom study plans",
      "Priority support",
    ],
    buttonText: "Go Pro",
    buttonVariant: "bg-black text-white",
    textColor: "text-black",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "For multiple teams",
      "Unlimited flashcards",
      "Custom study plans",
      "Dedicated support",
    ],
    buttonText: "Get started with Enterprise",
    buttonVariant: "bg-white text-black",
    textColor: "text-white",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const Pricings = () => {
  const handleCheckout = async (amount, currency, interval) => {
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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

      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }

  };
  return (
    <div id='pricings' className="bg-gradient-to-b from-black to-[#5D2CA8] text-white py-[20px] pb-20">
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
              {plan.isPro ? (
                <button
                  className={`mt-6 py-2 px-4 rounded-lg font-bold ${plan.buttonVariant}`}
                  onClick={() => handleCheckout(10, 'eur', 'month')}
                >
                  {plan.buttonText}
                </button>
              ) : (
                <button className={`mt-6 py-2 px-4 rounded-lg font-bold ${plan.buttonVariant}`}>
                  {plan.buttonText}
                </button>
              )}
        </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Pricings;
