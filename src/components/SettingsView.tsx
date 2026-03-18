/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  User,
  Lock,
  Share2,
  Bell,
  ChevronRight,
  X,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { FamilyMember } from "../types";
import { getInitials } from "../utils/stats";

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
  onSwitchProfile,
}: SettingsViewProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#F2F2F7] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 relative flex items-center justify-center">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute left-6 p-2 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-400" />
        </button>

        {/* Center Title */}
        <h2 className="text-lg font-bold text-gray-900">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-[32px] p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
            {activeMember?.image ? (
              <img
                src={activeMember.image}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xl font-bold text-blue-500">
                {getInitials(activeMember?.name || "")}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">
              {activeMember?.name}
            </h3>
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
        <div className="flex flex-col gap-4">
          {/* Passcode Lock */}
          <div className="bg-white rounded-[24px] overflow-hidden">
            <SettingsItem
              icon={<Lock size={18} />}
              label="Passcode Lock"
              onClick={onPasscode}
              color="bg-blue-50 text-blue-500"
            />
          </div>

          {/* Data Sync */}
          <div className="bg-white rounded-[24px] overflow-hidden">
            <SettingsItem
              icon={<Share2 size={18} />}
              label="Data Sync"
              onClick={onSync}
              color="bg-blue-50 text-blue-500"
            />
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-[24px] overflow-hidden">
            <div className="flex items-center justify-between p-4 px-5">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <span className="font-bold text-gray-900">
                  Push Notifications
                </span>
              </div>
              <button
                type="button"
                aria-pressed={notificationsEnabled}
                onClick={onToggleNotifications}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notificationsEnabled ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    notificationsEnabled ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
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
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <span className="font-bold text-gray-900">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </button>
  );
}
