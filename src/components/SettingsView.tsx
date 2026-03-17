/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { User, Lock, Share2, Bell, ChevronRight, X, LogOut } from 'lucide-react';
import { FamilyMember } from '../types';
import { getInitials } from '../utils/stats';

interface SettingsViewProps {
  activeMember: FamilyMember | undefined;
  onClose: () => void;
  onEditProfile: () => void;
  onPasscode: () => void;
  onSync: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onSwitchProfile: () => void;
}

export default function SettingsView({
  activeMember,
  onClose,
  onEditProfile,
  onPasscode,
  onSync,
  notificationsEnabled,
  onToggleNotifications,
  onSwitchProfile
}: SettingsViewProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#F2F2F7] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between bg-white border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-[32px] p-6 flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
            {activeMember?.image ? (
              <img src={activeMember.image} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-xl font-bold text-blue-500">
                {getInitials(activeMember?.name || '')}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{activeMember?.name}</h3>
            <p className="text-sm text-gray-500">{activeMember?.role}</p>
          </div>
          <button 
            onClick={onEditProfile}
            className="text-xs font-bold text-blue-500 bg-blue-50 px-4 py-2 rounded-full"
          >
            Edit
          </button>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          <section>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2">Security</h4>
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm">
              <SettingsItem 
                icon={<Lock size={18} />} 
                label="Passcode Lock" 
                onClick={onPasscode}
                color="bg-blue-50 text-blue-500"
              />
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2">Data</h4>
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm">
              <SettingsItem 
                icon={<Share2 size={18} />} 
                label="Data Sync" 
                onClick={onSync}
                color="bg-blue-50 text-blue-500"
              />
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 mb-2">Notifications</h4>
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-4 px-5">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <span className="font-bold text-gray-900">Push Notifications</span>
                </div>
                <button 
                  onClick={onToggleNotifications}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-blue-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          <section className="pt-4">
            <button 
              onClick={onSwitchProfile}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white text-red-500 font-bold shadow-sm active:scale-[0.98] transition-transform"
            >
              <LogOut size={18} />
              Switch Profile
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

function SettingsItem({ icon, label, onClick, color }: SettingsItemProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 px-5 hover:bg-gray-50 transition-colors active:bg-gray-100"
    >
      <div className="flex items-center gap-4">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="font-bold text-gray-900">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </button>
  );
}
