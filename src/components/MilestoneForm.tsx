/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FamilyMember } from '../types';

interface MilestoneFormProps {
  members: FamilyMember[];
  onSave: (milestone: { memberId: string; title: string; date: string; description: string }) => void;
  onClose: () => void;
  initialData?: any;
}

export default function MilestoneForm({ members, onSave, onClose, initialData }: MilestoneFormProps) {
  const [memberId, setMemberId] = useState(initialData?.memberId || members[0]?.id || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !title) return;
    onSave({
      memberId,
      title,
      description,
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[30px] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">{initialData ? 'Edit Milestone' : 'New Milestone'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Family Member</label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full bg-[#F2F2F7] border-none rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Milestone Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., First Steps"
              className="w-full bg-[#F2F2F7] border-none rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the story..."
              className="w-full bg-[#F2F2F7] border-none rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
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
            className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform mt-4"
          >
            Save Milestone
          </button>
        </form>
      </div>
    </div>
  );
}
