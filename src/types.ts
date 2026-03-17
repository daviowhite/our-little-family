/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = string;

export interface FamilyMember {
  id: string;
  name: string;
  role: Role;
  birthday: string; // ISO format: YYYY-MM-DD
  image?: string; // Base64 or URL
}

export interface GrowthRecord {
  id: string;
  memberId: string;
  date: string;
  weight?: number;
  height?: number;
  notes?: string;
}

export interface Milestone {
  id: string;
  memberId: string;
  title: string;
  date: string;
  description?: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
  createdBy: string; // Member ID
}

export interface FamilyStory {
  id: string;
  title: string;
  date: string; // ISO format: YYYY-MM-DD
  icon: string;
  description?: string;
  createdBy: string; // activeProfile
}

export interface AppData {
  familyMembers: FamilyMember[];
  growthRecords: GrowthRecord[];
  milestones: Milestone[];
  memories: Memory[];
  familyStories: FamilyStory[];
  activeProfile: string | null;
  birthdayShownDate: string | null;
}
