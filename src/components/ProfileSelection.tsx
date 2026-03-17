/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { User, Plus, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { setData, STORAGE_KEYS } from '../services/storage';
import { FamilyMember } from '../types';

interface ProfileSelectionProps {
  members: FamilyMember[];
  onSelect: (profileId: string) => void;
  onCreateFirst: (data: Omit<FamilyMember, 'id'>) => void;
}

export default function ProfileSelection({ members, onSelect, onCreateFirst }: ProfileSelectionProps) {
  const [isCreating, setIsCreating] = useState(members.length === 0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [birthday, setBirthday] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (profileId: string) => {
    setData(STORAGE_KEYS.ACTIVE_PROFILE, profileId);
    onSelect(profileId);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !birthday) return;
    onCreateFirst({ name, role, birthday, image });
  };

  if (isCreating) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full bg-[#F2F2F7] p-6"
      >
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-500 mb-8">Let's set up your profile to get started.</p>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 space-y-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden cursor-pointer group"
              >
                {image ? (
                  <img src={image} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={40} className="text-blue-500" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Davio White"
                  className="w-full bg-[#F2F2F7] border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Your Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Husband, Wife"
                  className="w-full bg-[#F2F2F7] border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Birthday</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full bg-[#F2F2F7] border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg shadow-blue-200"
            >
              Create Profile
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full bg-[#F2F2F7] p-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-12">Who’s using the app?</h1>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
        {members.map(member => (
          <ProfileCard 
            key={member.id}
            label={member.name}
            image={member.image}
            onClick={() => handleSelect(member.id)}
          />
        ))}
        <ProfileCard 
          label="Add New"
          icon={<Plus className="text-blue-500" size={32} />}
          onClick={() => setIsCreating(true)}
        />
      </div>
    </motion.div>
  );
}

interface ProfileCardProps {
  label: string;
  icon?: React.ReactNode;
  image?: string;
  onClick: () => void;
  key?: string | number;
}

function ProfileCard({ label, icon, image, onClick }: ProfileCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95, opacity: 0.8 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center bg-white p-6 rounded-[32px] aspect-square shadow-sm"
    >
      <div className="mb-3 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          icon || <User className="text-blue-500" size={32} />
        )}
      </div>
      <span className="text-sm font-bold text-gray-800 text-center line-clamp-1">{label}</span>
    </motion.button>
  );
}
