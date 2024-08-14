import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../firebase'; // Adjust the import path as needed
import { collection, addDoc } from 'firebase/firestore';

const Modal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Submitting data...');
    
    try {
      await addDoc(collection(db, 'waitlist'), {
        name,
        email,
        timestamp: new Date(),
      });
  
      console.log('Data submitted successfully');
      setMessage('Thank you for joining the waitlist!');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage('Failed to join the waitlist. Please try again.');
    }
  };
  

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white text-black rounded-lg p-8 w-full max-w-md mx-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Join the Waitlist</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your Email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg font-bold bg-gradient-to-b from-black to-[#5D2CA8] text-white hover:opacity-90"
          >
            Join Waitlist
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
