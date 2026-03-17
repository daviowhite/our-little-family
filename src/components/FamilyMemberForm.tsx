/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, UserPlus, Calendar, Users, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { FamilyMember } from '../types';

interface FamilyMemberFormProps {
  onSave: (data: Omit<FamilyMember, 'id'>) => void;
  onClose: () => void;
}

export default function FamilyMemberForm({ onSave, onClose }: FamilyMemberFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Son');
  const [birthday, setBirthday] = useState('');

  const roles = [
    'Father', 'Mother', 'Son', 'Daughter', 
    'Grandfather', 'Grandmother', 
    'Uncle', 'Aunt', 'Cousin', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthday) return;
    onSave({ name, role, birthday });
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
              <UserPlus size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Add Family Member</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grandma Rose"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Birthday</label>
            <div className="relative">
              <input
                type="date"
                required
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform"
            >
              Save Member
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
