/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { X, Camera, User } from 'lucide-react';
import { FamilyMember } from '../types';

interface EditProfileFormProps {
  member: FamilyMember;
  onSave: (data: Partial<FamilyMember>) => void;
  onClose: () => void;
}

export default function EditProfileForm({ member, onSave, onClose }: EditProfileFormProps) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [birthday, setBirthday] = useState(member.birthday);
  const [image, setImage] = useState<string | undefined>(member.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    onSave({ name, role, birthday, image });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">Edit Profile</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload */}
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
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs font-bold text-blue-500 uppercase tracking-wider"
            >
              Change Photo
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F2F2F7] border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Husband, Wife"
                className="w-full bg-[#F2F2F7] border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full bg-[#F2F2F7] border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-lg shadow-blue-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
