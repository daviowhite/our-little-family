/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, X } from 'lucide-react';

interface ItemActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  title?: string;
}

export default function ItemActionSheet({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  title = 'Options',
}: ItemActionSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110]"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[120] px-4 pb-8 pt-4 bg-white rounded-t-[32px] shadow-2xl max-w-md mx-auto"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            
            <div className="px-2 mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onEdit();
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Edit2 size={20} />
                </div>
                <span className="font-bold text-gray-900">Edit</span>
              </button>
              
              <button
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center shadow-sm">
                  <Trash2 size={20} />
                </div>
                <span className="font-bold text-red-600">Delete</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full mt-2 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
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
