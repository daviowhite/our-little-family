/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Milestone, TrendingUp, Camera, Heart } from 'lucide-react';

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMilestone: () => void;
  onAddGrowth: () => void;
  onAddMemory: () => void;
  onAddStory: () => void;
}

export default function ActionSheet({ isOpen, onClose, onAddMilestone, onAddGrowth, onAddMemory, onAddStory }: ActionSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#F2F2F7] rounded-t-[20px] z-[70] pb-10 px-4 pt-2 max-w-md mx-auto"
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  onAddMemory();
                  onClose();
                }}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 active:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Camera size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Add Memory</div>
                  <div className="text-xs text-gray-500">Capture a special moment</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onAddMilestone();
                  onClose();
                }}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 active:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Milestone size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Add Milestone</div>
                  <div className="text-xs text-gray-500">Record a special moment</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onAddGrowth();
                  onClose();
                }}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 active:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <TrendingUp size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Add Growth Record</div>
                  <div className="text-xs text-gray-500">Log height and weight</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onAddStory();
                  onClose();
                }}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 active:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Heart size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Add Family Story</div>
                  <div className="text-xs text-gray-500">Record a special family event</div>
                </div>
              </button>

              <button
                onClick={onClose}
                className="w-full bg-white rounded-2xl p-4 text-center font-semibold text-[#FF3B30] active:bg-gray-50 transition-colors mt-2"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
