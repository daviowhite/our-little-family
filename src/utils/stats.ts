/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FamilyMember } from '../types';

export const calculateDaysTogether = (startDateStr: string): number => {
  const start = new Date(startDateStr);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateNextBirthday = (members: FamilyMember[]): { days: number; name: string } | null => {
  if (!members.length) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let closest: { days: number; name: string } | null = null;

  members.forEach(member => {
    const bday = new Date(member.birthday);
    const nextBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());

    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = nextBday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (closest === null || diffDays < closest.days) {
      closest = { days: diffDays, name: member.name };
    }
  });

  return closest;
};

export const formatMonthYear = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const calculateAge = (birthday: string): string => {
  const birthDate = new Date(birthday);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }
  
  if (years === 0) {
    return `${months} mos`;
  }
  
  return `${years} yrs`;
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};
