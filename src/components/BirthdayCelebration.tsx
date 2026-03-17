/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Balloon {
  id: number;
  left: number;
  duration: number;
  color: string;
  isPopping: boolean;
}

const BALLOON_COLORS = ['#007AFF', '#5856D6', '#00C7BE', '#30B0C7', '#32ADE6', '#0040DD'];

export default function BirthdayCelebration({ onComplete }: { onComplete: () => void }) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [counter, setCounter] = useState(0);

  const spawnBalloon = useCallback(() => {
    const newBalloon: Balloon = {
      id: Date.now() + Math.random(),
      left: Math.random() * 90, // 0-90%
      duration: 4 + Math.random() * 4, // 4-8 seconds
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      isPopping: false,
    };
    setBalloons((prev) => [...prev, newBalloon]);
  }, []);

  useEffect(() => {
    // Spawn balloons continuously
    const spawnInterval = setInterval(spawnBalloon, 800);
    
    // Auto-complete after 60 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 60000);

    return () => {
      clearInterval(spawnInterval);
      clearTimeout(timer);
    };
  }, [spawnBalloon, onComplete]);

  const popBalloon = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPopping: true } : b))
    );
    // Remove after animation
    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== id));
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
      {/* Balloons Layer */}
      <div className="absolute inset-0">
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className={`absolute pointer-events-auto cursor-pointer ${
              balloon.isPopping ? 'animate-pop' : 'animate-fall'
            }`}
            style={{
              left: `${balloon.left}%`,
              animationDuration: `${balloon.duration}s`,
              top: '-10vh',
            }}
            onClick={() => popBalloon(balloon.id)}
          >
            <svg
              width="60"
              height="80"
              viewBox="0 0 60 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0Z"
                fill={balloon.color}
              />
              <path
                d="M30 60L25 70H35L30 60Z"
                fill={balloon.color}
              />
              <path
                d="M30 70C30 70 25 75 30 80"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="2"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Message Layer */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-6"
      >
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-[32px] border border-white/20">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Happy Birthday ❤️</h2>
          <p className="text-lg text-gray-600">Today is your special day!</p>
        </div>
      </motion.div>
    </div>
  );
}
