/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
}: ConfirmationDialogProps) {
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
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110]"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[120] px-4 pb-8 pt-6 bg-white rounded-t-[32px] shadow-2xl max-w-md mx-auto"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                <AlertCircle size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-[280px] leading-relaxed">
                {message}
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full py-4 rounded-2xl font-bold transition-transform active:scale-[0.98] ${
                    isDestructive 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                      : 'bg-[#007AFF] text-white shadow-lg shadow-blue-200'
                  }`}
                >
                  {confirmLabel}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  {cancelLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
