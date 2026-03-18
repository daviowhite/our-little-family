/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Home,
  Heart,
  TrendingUp,
  Users,
  Ruler,
  Weight,
  Calendar,
  Footprints,
  Image,
  Gift,
  Plus,
  ChevronDown,
  WifiOff,
  Trophy,
  Settings,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  initializeAppData,
  getData,
  setData,
  STORAGE_KEYS,
} from "./services/storage";
import ProfileSelection from "./components/ProfileSelection";
import BirthdayCelebration from "./components/BirthdayCelebration";
import StatCard from "./components/StatCard";
import Timeline from "./components/Timeline";
import ActionSheet from "./components/ActionSheet";
import GrowthForm from "./components/GrowthForm";
import MilestoneForm from "./components/MilestoneForm";
import MemoryForm from "./components/MemoryForm";
import SyncSection from "./components/SyncSection";
import FamilyMemberForm from "./components/FamilyMemberForm";
import FamilyStoryForm from "./components/FamilyStoryForm";
import LockScreen from "./components/LockScreen";
import PasscodeModal from "./components/PasscodeModal";
import ConfirmationDialog from "./components/ConfirmationDialog";
import ItemActionSheet from "./components/ItemActionSheet";
import SettingsView from "./components/SettingsView";
import EditProfileForm from "./components/EditProfileForm";
import {
  requestNotificationPermission,
  checkAndNotifyBirthday,
} from "./services/notification";
import {
  calculateDaysTogether,
  calculateNextBirthday,
  formatMonthYear,
  calculateAge,
  getInitials,
} from "./utils/stats";
import {
  FamilyMember,
  GrowthRecord,
  Memory,
  Milestone,
  FamilyStory,
} from "./types";

type Tab = "home" | "memories" | "growth" | "family";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showBirthday, setShowBirthday] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // UI State
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<
    | "growth"
    | "milestone"
    | "memory"
    | "familyMember"
    | "story"
    | "passcode"
    | null
  >(null);
  const [passcodeMode, setPasscodeMode] = useState<"set" | "change" | "remove">(
    "set"
  );
  const [growthFilter, setGrowthFilter] = useState<string>("children"); // Default to babies

  // Item Action State
  const [itemActionSheet, setItemActionSheet] = useState<{
    isOpen: boolean;
    type: "memory" | "growth" | "milestone" | "story";
    item: any;
  }>({ isOpen: false, type: "memory", item: null });

  // Confirmation State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const [editingItem, setEditingItem] = useState<any>(null);

  // Passcode State
  const [passcode, setPasscode] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Data State
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [familyStories, setFamilyStories] = useState<FamilyStory[]>([]);

  // Stats State
  const [stats, setStats] = useState({
    height: "0 ft",
    weight: "0 kg",
    daysTogether: 0,
    steps: "4,230",
    memoriesCount: 0,
    nextBirthday: { days: 0, name: "" },
    lastUpdated: formatMonthYear(),
  });

  useEffect(() => {
    initializeAppData();
    const profile = getData<string>(STORAGE_KEYS.ACTIVE_PROFILE);
    const savedPasscode = getData<string>(STORAGE_KEYS.APP_PASSCODE);

    setPasscode(savedPasscode);
    if (savedPasscode) {
      setIsLocked(true);
    }

    setActiveProfile(profile);
    setIsInitialized(true);
    loadData();

    if (profile) {
      checkBirthday(profile);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (activeProfile) {
      updateStats(activeProfile);
    }
  }, [activeProfile, growthRecords, milestones, memories]);

  const loadData = () => {
    const m = getData<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS) || [];
    const g = getData<GrowthRecord[]>(STORAGE_KEYS.GROWTH_RECORDS) || [];
    const ms = getData<Milestone[]>(STORAGE_KEYS.MILESTONES) || [];
    const mems = getData<Memory[]>(STORAGE_KEYS.MEMORIES) || [];
    const fs = getData<FamilyStory[]>(STORAGE_KEYS.FAMILY_STORIES) || [];
    setMembers(m);
    setGrowthRecords(g);
    setMilestones(ms);
    setMemories(mems);
    setFamilyStories(fs);
  };

  const updateStats = (profileId: string) => {
    // Filter records for active profile
    const profileRecords = growthRecords
      .filter((r) => r.memberId === profileId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latestRecord = profileRecords[0];
    const nextBday = calculateNextBirthday(members);

    // Find earliest date in the app to calculate days together
    const allDates = [
      ...familyStories.map((s) => s.date),
      ...memories.map((m) => m.date),
      ...growthRecords.map((g) => g.date),
      ...milestones.map((ms) => ms.date),
    ].sort();

    const earliestDate = allDates[0] || new Date().toISOString().split("T")[0];

    setStats({
      height: latestRecord?.height ? `${latestRecord.height} cm` : "--",
      weight: latestRecord?.weight ? `${latestRecord.weight} kg` : "--",
      daysTogether: calculateDaysTogether(earliestDate),
      steps: "--",
      memoriesCount: memories.length,
      nextBirthday: nextBday || { days: 0, name: "" },
      lastUpdated: formatMonthYear(),
    });
  };

  const checkBirthday = (profileId: string) => {
    const m = getData<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS) || [];
    const member = m.find((m) => m.id === profileId);

    if (member && member.birthday) {
      const today = new Date();
      const todayStr = `${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

      const birthdayParts = member.birthday.split("-");
      const memberBirthdayStr = `${birthdayParts[1]}-${birthdayParts[2]}`;

      if (todayStr === memberBirthdayStr) {
        const lastShown = getData<string>(STORAGE_KEYS.BIRTHDAY_SHOWN_DATE);
        const todayFullStr = today.toISOString().split("T")[0];

        if (lastShown !== todayFullStr) {
          setShowBirthday(true);
          setData(STORAGE_KEYS.BIRTHDAY_SHOWN_DATE, todayFullStr);
          checkAndNotifyBirthday(member.name);
        }
      }
    }
  };

  const handleProfileSelect = async (profileId: string) => {
    setActiveProfile(profileId);
    checkBirthday(profileId);

    // Request notification permission after profile selection
    await requestNotificationPermission();
  };

  const handleCreateFirstProfile = (data: Omit<FamilyMember, "id">) => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      ...data,
    };
    const updated = [...members, newMember];
    setData(STORAGE_KEYS.FAMILY_MEMBERS, updated);
    setMembers(updated);
    setData(STORAGE_KEYS.ACTIVE_PROFILE, newMember.id);
    setActiveProfile(newMember.id);
  };

  const handleUpdateProfile = (data: Partial<FamilyMember>) => {
    if (!activeProfile) return;
    const updated = members.map((m) =>
      m.id === activeProfile ? { ...m, ...data } : m
    );
    setData(STORAGE_KEYS.FAMILY_MEMBERS, updated);
    setMembers(updated);
    setActiveForm(null);
  };

  const handleSaveGrowth = (data: any) => {
    if (editingItem) {
      const updated = growthRecords.map((r) =>
        r.id === editingItem.id ? { ...r, ...data } : r
      );
      setData(STORAGE_KEYS.GROWTH_RECORDS, updated);
      setGrowthRecords(updated);
      setEditingItem(null);
    } else {
      const newRecord: GrowthRecord = {
        id: Date.now().toString(),
        ...data,
      };
      const updated = [...growthRecords, newRecord];
      setData(STORAGE_KEYS.GROWTH_RECORDS, updated);
      setGrowthRecords(updated);
    }
    setActiveForm(null);
  };

  const handleDeleteGrowth = (id: string) => {
    const updated = growthRecords.filter((r) => r.id !== id);
    setData(STORAGE_KEYS.GROWTH_RECORDS, updated);
    setGrowthRecords(updated);
  };

  const handleSaveMilestone = (data: any) => {
    if (editingItem) {
      const updated = milestones.map((m) =>
        m.id === editingItem.id ? { ...m, ...data } : m
      );
      setData(STORAGE_KEYS.MILESTONES, updated);
      setMilestones(updated);
      setEditingItem(null);
    } else {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        ...data,
      };
      const updated = [...milestones, newMilestone];
      setData(STORAGE_KEYS.MILESTONES, updated);
      setMilestones(updated);
    }
    setActiveForm(null);
  };

  const handleDeleteMilestone = (id: string) => {
    const updated = milestones.filter((m) => m.id !== id);
    setData(STORAGE_KEYS.MILESTONES, updated);
    setMilestones(updated);
  };

  const handleSaveMemory = (data: any) => {
    if (editingItem) {
      const updated = memories.map((m) =>
        m.id === editingItem.id ? { ...m, ...data } : m
      );
      setData(STORAGE_KEYS.MEMORIES, updated);
      setMemories(updated);
      setEditingItem(null);
    } else {
      const newMemory: Memory = {
        id: Date.now().toString(),
        createdBy: activeProfile!,
        ...data,
      };
      const updated = [newMemory, ...memories];
      setData(STORAGE_KEYS.MEMORIES, updated);
      setMemories(updated);
    }
    setActiveForm(null);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    setData(STORAGE_KEYS.MEMORIES, updated);
    setMemories(updated);
  };

  const handleSaveStory = (data: any) => {
    const newStory: FamilyStory = {
      id: Date.now().toString(),
      createdBy: activeProfile!,
      ...data,
    };
    const updated = [...familyStories, newStory];
    setData(STORAGE_KEYS.FAMILY_STORIES, updated);
    setFamilyStories(updated);
    setActiveForm(null);
  };

  const openDeleteConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleSaveFamilyMember = (data: Omit<FamilyMember, "id">) => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      ...data,
    };
    const updated = [...members, newMember];
    setData(STORAGE_KEYS.FAMILY_MEMBERS, updated);
    setMembers(updated);
    setActiveForm(null);
  };

  const handleSavePasscode = (newPasscode: string | null) => {
    setData(STORAGE_KEYS.APP_PASSCODE, newPasscode);
    setPasscode(newPasscode);
    setActiveForm(null);
  };

  if (!isInitialized) return null;

  if (!activeProfile) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-white relative overflow-hidden">
        <ProfileSelection
          members={members}
          onSelect={handleProfileSelect}
          onCreateFirst={handleCreateFirstProfile}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        const activeMember = members.find((m) => m.id === activeProfile);
        const today = new Date();
        const isBirthday =
          activeMember &&
          new Date(activeMember.birthday).getMonth() === today.getMonth() &&
          new Date(activeMember.birthday).getDate() === today.getDate();

        return (
          <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-4">
              <StatCard
                title="Height"
                icon={Ruler}
                value={stats.height}
                updatedAt={stats.lastUpdated}
                bgColor="bg-blue-50"
                iconColor="text-blue-500"
              />
              <StatCard
                title="Weight"
                icon={Weight}
                value={stats.weight}
                updatedAt={stats.lastUpdated}
                bgColor="bg-blue-50"
                iconColor="text-blue-500"
              />
              <StatCard
                title="Days Together"
                icon={Calendar}
                value={stats.daysTogether}
                updatedAt={stats.lastUpdated}
                bgColor="bg-blue-50"
                iconColor="text-blue-500"
              />
              <StatCard
                title="Steps"
                icon={Footprints}
                value={stats.steps}
                updatedAt={stats.lastUpdated}
                bgColor="bg-blue-50"
                iconColor="text-blue-500"
              />
              <StatCard
                title="Memories"
                icon={Image}
                value={stats.memoriesCount}
                updatedAt={stats.lastUpdated}
                bgColor="bg-blue-50"
                iconColor="text-blue-500"
              />
              <StatCard
                title="Next Birthday"
                icon={Gift}
                value={`${stats.nextBirthday.days} days`}
                updatedAt={stats.lastUpdated}
                bgColor="bg-blue-50"
                iconColor="text-blue-500"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              {familyStories.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                    <Heart size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No stories yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Start building your family timeline together.
                  </p>
                  <button
                    onClick={() => setActiveForm("story")}
                    className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-transform"
                  >
                    Add First Story
                  </button>
                </div>
              ) : (
                <Timeline events={familyStories} />
              )}
            </div>
          </div>
        );
      case "memories":
        return (
          <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-6">
              {memories.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                    <Image size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No memories yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Capture your first special moment together.
                  </p>
                  <button
                    onClick={() => setActiveForm("memory")}
                    className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-transform"
                  >
                    Add First Memory
                  </button>
                </div>
              ) : (
                memories.map((memory) => {
                  const creator = members.find(
                    (m) => m.id === memory.createdBy
                  );
                  return (
                    <motion.div
                      key={memory.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setItemActionSheet({
                          isOpen: true,
                          type: "memory",
                          item: memory,
                        })
                      }
                      className="bg-white rounded-2xl overflow-hidden group cursor-pointer active:bg-gray-50 transition-colors"
                    >
                      {memory.image && (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={memory.image}
                            alt={memory.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {memory.title}
                          </h3>
                          <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-1 rounded-full">
                            {new Date(memory.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        {memory.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {memory.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            {creator?.name.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-400">
                            Shared by{" "}
                            <span className="font-medium text-gray-600">
                              {creator?.name}
                            </span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        );
      case "growth":
        const filteredRecords = growthRecords
          .filter((r) => {
            if (growthFilter === "all") return true;
            if (growthFilter === "children") {
              const m = members.find((mem) => mem.id === r.memberId);
              const babyRoles = ["Son", "Daughter", "Child"];
              return babyRoles.includes(m?.role || "");
            }
            return r.memberId === growthFilter;
          })
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        return (
          <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex justify-end items-center">
              <div className="relative">
                <select
                  value={growthFilter}
                  onChange={(e) => setGrowthFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="children">Babies Only</option>
                  <option value="all">All Members</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {filteredRecords.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                    <TrendingUp size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No records yet
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Start tracking growth to see progress here.
                  </p>
                  <button
                    onClick={() => setIsActionSheetOpen(true)}
                    className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-transform"
                  >
                    Add Growth Record
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => {
                    const member = members.find(
                      (m) => m.id === record.memberId
                    );
                    return (
                      <motion.div
                        key={record.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setItemActionSheet({
                            isOpen: true,
                            type: "growth",
                            item: record,
                          })
                        }
                        className="bg-white rounded-2xl p-4 flex justify-between items-center cursor-pointer active:bg-gray-50 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                            {member?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase">
                              Weight
                            </div>
                            <div className="font-bold text-gray-900">
                              {record.weight} kg
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase">
                              Height
                            </div>
                            <div className="font-bold text-gray-900">
                              {record.height} cm
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Milestones Section */}
            <div className="pt-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Milestones
              </h3>
              <div className="flex flex-col gap-4">
                {milestones.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                      <Trophy size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      No milestones yet
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Celebrate and record those big first steps.
                    </p>
                    <button
                      onClick={() => setActiveForm("milestone")}
                      className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-transform"
                    >
                      Add Milestone
                    </button>
                  </div>
                ) : (
                  milestones.map((ms) => {
                    const member = members.find((m) => m.id === ms.memberId);
                    return (
                      <motion.div
                        key={ms.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setItemActionSheet({
                            isOpen: true,
                            type: "milestone",
                            item: ms,
                          })
                        }
                        className="bg-white rounded-2xl p-4 cursor-pointer active:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                              {member?.name}
                            </div>
                            <h4 className="font-bold text-gray-900">
                              {ms.title}
                            </h4>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(ms.date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {ms.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {ms.description}
                          </p>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      case "family":
        const initialIds = ["husband", "wife", "son"];
        const hasExtraMembers = members.some((m) => !initialIds.includes(m.id));

        return (
          <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <section>
              <div className="flex flex-col gap-6">
                {!hasExtraMembers ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-[#007AFF] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                      <Users size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Your Family
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      You can add more family members here to track their growth
                      and birthdays.
                    </p>
                    <button
                      onClick={() => setActiveForm("familyMember")}
                      className="bg-[#007AFF] text-white px-8 py-3 rounded-full font-bold active:scale-95 transition-transform"
                    >
                      Add Family Member
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white rounded-2xl p-5 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-blue-500 font-bold text-xl">
                                {member.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900">
                                {member.name}
                              </h4>
                              <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
                                {member.role}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Born{" "}
                              {new Date(member.birthday).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {calculateAge(member.birthday)}
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            Age
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      {/* Birthday Celebration Overlay */}
      <AnimatePresence>
        {showBirthday && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <BirthdayCelebration onComplete={() => setShowBirthday(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Sheet */}
      <ActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onAddMilestone={() => setActiveForm("milestone")}
        onAddGrowth={() => setActiveForm("growth")}
        onAddMemory={() => setActiveForm("memory")}
        onAddStory={() => setActiveForm("story")}
      />

      {/* Forms */}
      <AnimatePresence>
        {activeForm === "growth" && (
          <GrowthForm
            members={members}
            onSave={handleSaveGrowth}
            onClose={() => {
              setActiveForm(null);
              setEditingItem(null);
            }}
            initialData={editingItem}
          />
        )}
        {activeForm === "milestone" && (
          <MilestoneForm
            members={members}
            onSave={handleSaveMilestone}
            onClose={() => {
              setActiveForm(null);
              setEditingItem(null);
            }}
            initialData={editingItem}
          />
        )}
        {activeForm === "memory" && (
          <MemoryForm
            onSave={handleSaveMemory}
            onClose={() => {
              setActiveForm(null);
              setEditingItem(null);
            }}
            initialData={editingItem}
          />
        )}
        {activeForm === "familyMember" && (
          <FamilyMemberForm
            onSave={handleSaveFamilyMember}
            onClose={() => setActiveForm(null)}
          />
        )}
        {activeForm === "story" && (
          <FamilyStoryForm
            onSave={handleSaveStory}
            onClose={() => setActiveForm(null)}
          />
        )}
        {activeForm === "editProfile" && (
          <EditProfileForm
            member={members.find((m) => m.id === activeProfile)!}
            onSave={handleUpdateProfile}
            onClose={() => setActiveForm(null)}
          />
        )}
        {activeForm === "passcode" && (
          <PasscodeModal
            mode={passcodeMode}
            currentPasscode={passcode || undefined}
            onSave={handleSavePasscode}
            onClose={() => setActiveForm(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsView
            activeMember={members.find((m) => m.id === activeProfile)}
            onClose={() => setIsSettingsOpen(false)}
            onEditProfile={() => setActiveForm("editProfile")}
            onPasscode={() => {
              setPasscodeMode(passcode ? "change" : "set");
              setActiveForm("passcode");
            }}
            onSync={() => setActiveForm("sync" as any)}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={() =>
              setNotificationsEnabled(!notificationsEnabled)
            }
            onSwitchProfile={() => {
              setActiveProfile(null);
              setIsSettingsOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Sync Modal (Moved to Settings) */}
      <AnimatePresence>
        {activeForm === ("sync" as any) && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Data Sync</h3>
                  <button
                    onClick={() => setActiveForm(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <SyncSection />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item Action Sheet */}
      <ItemActionSheet
        isOpen={itemActionSheet.isOpen}
        onClose={() =>
          setItemActionSheet({ ...itemActionSheet, isOpen: false })
        }
        title={`${itemActionSheet.type} Options`}
        onEdit={() => {
          setEditingItem(itemActionSheet.item);
          setActiveForm(itemActionSheet.type as any);
        }}
        onDelete={() => {
          const item = itemActionSheet.item;
          openDeleteConfirmation(
            `Delete ${itemActionSheet.type}?`,
            "This action cannot be undone.",
            () => {
              if (itemActionSheet.type === "memory")
                handleDeleteMemory(item.id);
              if (itemActionSheet.type === "growth")
                handleDeleteGrowth(item.id);
              if (itemActionSheet.type === "milestone")
                handleDeleteMilestone(item.id);
            }
          );
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Delete"
        isDestructive={true}
      />

      {isLocked && passcode && (
        <LockScreen
          correctPasscode={passcode}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#F2F2F7] relative">
        <div className="px-6 pt-10 pb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {activeTab === "home" && <>Hi Baby 👋</>}
            {activeTab === "memories" && <>Memory</>}
            {activeTab === "growth" && <>Growth</>}
            {activeTab === "family" && <>Family</>}
          </h1>
          {activeTab === "home" && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center overflow-hidden active:scale-90 transition-transform"
            >
              {members.find((m) => m.id === activeProfile)?.image ? (
                <img
                  src={members.find((m) => m.id === activeProfile)?.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-sm font-bold text-white">
                  {getInitials(
                    members.find((m) => m.id === activeProfile)?.name || ""
                  )}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="p-6 pt-2">{renderContent()}</div>

        {/* Global FAB */}
        {!(
          (activeTab === "memories" && memories.length === 0) ||
          (activeTab === "growth" &&
            growthRecords.length === 0 &&
            milestones.length === 0)
        ) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (activeTab === "memories") {
                setActiveForm("memory");
              } else {
                setIsActionSheetOpen(true);
              }
            }}
            className="fixed bottom-28 right-8 sm:absolute sm:bottom-28 sm:right-8 w-14 h-14 bg-[#007AFF] text-white rounded-full flex items-center justify-center z-50 active:scale-95 transition-transform"
          >
            <Plus size={28} />
          </motion.button>
        )}
      </main>

      {/* iOS Style Bottom Navigation */}
      <nav className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-xl border-t border-gray-200 px-6 pt-2 pb-8 flex justify-between items-center">
        <NavButton
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
          icon={<Home size={24} />}
          label="Home"
          id="nav-home"
        />
        <NavButton
          active={activeTab === "memories"}
          onClick={() => setActiveTab("memories")}
          icon={<Heart size={24} />}
          label="Memories"
          id="nav-memories"
        />
        <NavButton
          active={activeTab === "growth"}
          onClick={() => setActiveTab("growth")}
          icon={<TrendingUp size={24} />}
          label="Growth"
          id="nav-growth"
        />
        <NavButton
          active={activeTab === "family"}
          onClick={() => setActiveTab("family")}
          icon={<Users size={24} />}
          label="Family"
          id="nav-family"
        />
      </nav>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  id: string;
}

function NavButton({ active, onClick, icon, label, id }: NavButtonProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-200 ${
        active ? "text-[#007AFF]" : "text-[#8E8E93]"
      }`}
    >
      <div
        className={`transition-transform duration-200 ${
          active ? "scale-110" : "scale-100"
        }`}
      >
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
