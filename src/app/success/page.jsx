// pages/success.js
import React from 'react';

const Success = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="text-xl">Your subscription is now active.</p>
        <a href="/" className="mt-8 inline-block bg-purple-600 text-white py-2 px-4 rounded-lg">
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default Success;
