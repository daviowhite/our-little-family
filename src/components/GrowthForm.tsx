/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FamilyMember } from '../types';

interface GrowthFormProps {
  members: FamilyMember[];
  onSave: (record: { memberId: string; weight: number; height: number; date: string }) => void;
  onClose: () => void;
  initialData?: any;
}

export default function GrowthForm({ members, onSave, onClose, initialData }: GrowthFormProps) {
  const [memberId, setMemberId] = useState(initialData?.memberId || members[0]?.id || '');
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '');
  const [height, setHeight] = useState(initialData?.height?.toString() || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !weight || !height) return;
    onSave({
      memberId,
      weight: parseFloat(weight),
      height: parseFloat(height),
      date,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[30px] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">{initialData ? 'Edit Growth Record' : 'New Growth Record'}</h3>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.0"
                className="w-full bg-[#F2F2F7] border-none rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Height (ft)</label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="0.0"
                className="w-full bg-[#F2F2F7] border-none rounded-xl p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
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
            Save Record
          </button>
        </form>
      </div>
    </div>
  );
}
