/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  updatedAt: string;
  bgColor: string;
  iconColor: string;
}

export default function StatCard({ title, icon: Icon, value, updatedAt, bgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-4 flex flex-col justify-between min-h-[120px]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={`${iconColor}`}>
            <Icon size={16} />
          </div>
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">{title}</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium uppercase">{updatedAt}</span>
      </div>
      
      <div className="mt-4">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
    </div>
  );
}
