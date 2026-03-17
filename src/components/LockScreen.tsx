/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lock, Delete, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LockScreenProps {
  correctPasscode: string;
  onUnlock: () => void;
}

export default function LockScreen({ correctPasscode, onUnlock }: LockScreenProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (input.length === correctPasscode.length) {
      if (input === correctPasscode) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setInput('');
          setError(false);
        }, 500);
      }
    }
  }, [input, correctPasscode, onUnlock]);

  const handleNumberClick = (num: string) => {
    if (input.length < correctPasscode.length) {
      setInput(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setInput(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6">
      <motion.div 
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="flex flex-col items-center w-full max-w-xs"
      >
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
          <Lock size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Enter Passcode</h2>
        
        <div className="flex gap-4 mb-12">
          {Array.from({ length: correctPasscode.length }).map((_, i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                i < input.length 
                  ? 'bg-blue-500 border-blue-500 scale-110' 
                  : 'bg-transparent border-gray-200'
              } ${error ? 'border-blue-600 bg-blue-600' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-2xl font-semibold text-gray-900 active:bg-gray-200 transition-colors mx-auto"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick('0')}
            className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-2xl font-semibold text-gray-900 active:bg-gray-200 transition-colors mx-auto"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full flex items-center justify-center text-gray-400 active:text-gray-600 transition-colors mx-auto"
          >
            <Delete size={24} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
