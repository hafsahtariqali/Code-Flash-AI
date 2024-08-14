"use client";

import React from 'react';
import { FaLightbulb, FaChartBar, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <FaLightbulb size={18} color="#000" />,
    title: "Active Recall:",
    description:
      "Challenge your understanding with engaging questions and editable code snippets.",
  },
  {
    icon: <FaChartBar size={18} color="#000" />,
    title: "Customized Learning:",
    description:
      "Tailor your learning based on goals and skill level and get custom study plans",
  },
  {
    icon: <FaClock size={18} color="#000" />,
    title: "Spaced Repetition:",
    description:
      "Revisit concepts at optimal intervals for more effective retention.",
  },
];

export const Features = () => {
  return (
    <div id='features' className="bg-black text-white pb-20">
      <div className="container">
        <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter py-[72px]">
          Features
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {features.map(({ icon, title, description }) => (
            <motion.div
              key={title}
              className="border border-white/30 px-5 py-10 text-center rounded-xl sm:flex-1"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="inline-flex h-10 w-10 bg-white text-black justify-center items-center rounded-lg">
                {icon}
              </span>
              <h3 className="mt-6 font-bold text-lg">{title}</h3>
              <p className="mt-4 text-white/70">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
