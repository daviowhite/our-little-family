/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { X, Upload, Camera } from 'lucide-react';

interface MemoryFormProps {
  onSave: (memory: { title: string; description: string; image: string; date: string }) => void;
  onClose: () => void;
  initialData?: { title: string; description: string; image: string; date: string };
}

export default function MemoryForm({ onSave, onClose, initialData }: MemoryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
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
    if (!title || !image) return;
    onSave({
      title,
      description,
      image,
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[30px] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">{initialData ? 'Edit Memory' : 'New Memory'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video bg-[#F2F2F7] rounded-2xl flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <>
                <Camera size={32} className="text-gray-400 mb-2" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Tap to upload photo</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What happened?"
              className="w-full bg-[#F2F2F7] border-none rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="w-full bg-[#F2F2F7] border-none rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#F2F2F7] border-none rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!title || !image}
            className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform mt-4 disabled:opacity-50 disabled:active:scale-100"
          >
            Save Memory
          </button>
        </form>
      </div>
    </div>
  );
}
