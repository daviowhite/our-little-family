/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FamilyMember, FamilyStory } from '../types';

export const STORAGE_KEYS = {
  FAMILY_MEMBERS: 'familyMembers',
  GROWTH_RECORDS: 'growthRecords',
  MILESTONES: 'milestones',
  MEMORIES: 'memories',
  ACTIVE_PROFILE: 'activeProfile',
  BIRTHDAY_SHOWN_DATE: 'birthdayShownDate',
  FAMILY_STORIES: 'familyStories',
  APP_PASSCODE: 'appPasscode',
};

export const getData = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data from localStorage for key "${key}":`, error);
    return null;
  }
};

export const setData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting data in localStorage for key "${key}":`, error);
  }
};

export const initializeAppData = (): void => {
  // Check if familyMembers exists as a proxy for first-time load
  if (!localStorage.getItem(STORAGE_KEYS.FAMILY_MEMBERS)) {
    setData(STORAGE_KEYS.FAMILY_MEMBERS, []);
    setData(STORAGE_KEYS.GROWTH_RECORDS, []);
    setData(STORAGE_KEYS.MILESTONES, []);
    setData(STORAGE_KEYS.MEMORIES, []);
    setData(STORAGE_KEYS.ACTIVE_PROFILE, null);
    setData(STORAGE_KEYS.BIRTHDAY_SHOWN_DATE, null);
    setData(STORAGE_KEYS.FAMILY_STORIES, []);

    console.log('App data initialized in localStorage.');
  } else {
    // Ensure other keys exist even if familyMembers does
    if (localStorage.getItem(STORAGE_KEYS.FAMILY_STORIES) === null) {
      setData(STORAGE_KEYS.FAMILY_STORIES, []);
    }
    if (localStorage.getItem(STORAGE_KEYS.GROWTH_RECORDS) === null) setData(STORAGE_KEYS.GROWTH_RECORDS, []);
    if (localStorage.getItem(STORAGE_KEYS.MILESTONES) === null) setData(STORAGE_KEYS.MILESTONES, []);
    if (localStorage.getItem(STORAGE_KEYS.MEMORIES) === null) setData(STORAGE_KEYS.MEMORIES, []);
    if (localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE) === null) setData(STORAGE_KEYS.ACTIVE_PROFILE, null);
    if (localStorage.getItem(STORAGE_KEYS.BIRTHDAY_SHOWN_DATE) === null) setData(STORAGE_KEYS.BIRTHDAY_SHOWN_DATE, null);
  }
};

export const exportAppData = (): string => {
  const data: Record<string, any> = {};
  Object.values(STORAGE_KEYS).forEach(key => {
    data[key] = getData(key);
  });
  return JSON.stringify(data);
};

export const importAppData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (typeof data !== 'object' || data === null) return false;
    
    const keys = Object.values(STORAGE_KEYS);
    const hasValidKey = keys.some(key => key in data);
    if (!hasValidKey) return false;

    keys.forEach(key => {
      if (key in data) {
        setData(key, data[key]);
      }
    });
    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
};
