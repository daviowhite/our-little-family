/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, Heart, Plane, Users, FileText, Church, Sun, Baby, Star, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { FamilyStory } from '../types';

interface FamilyStoryFormProps {
  onSave: (data: Omit<FamilyStory, 'id'>) => void;
  onClose: () => void;
}

const ICONS = [
  { name: 'Heart', icon: Heart },
  { name: 'Plane', icon: Plane },
  { name: 'Users', icon: Users },
  { name: 'FileText', icon: FileText },
  { name: 'Church', icon: Church },
  { name: 'Sun', icon: Sun },
  { name: 'Baby', icon: Baby },
  { name: 'Star', icon: Star },
  { name: 'Home', icon: Home },
];

export default function FamilyStoryForm({ onSave, onClose }: FamilyStoryFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedIcon, setSelectedIcon] = useState('Heart');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    onSave({ 
      title, 
      date, 
      icon: selectedIcon,
      createdBy: '' // Will be set in App.tsx
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-md rounded-t-[32px] p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Heart size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Add Family Story</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Story Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Court Wedding"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Date</label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Select Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedIcon(name)}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === name 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform"
            >
              Save Story
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
