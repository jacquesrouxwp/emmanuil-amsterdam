import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Donation } from '@/types';

interface AppState {
  userName: string;
  setUserName: (name: string) => void;

  registeredEvents: string[];
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent: (eventId: string) => void;
  isRegistered: (eventId: string) => boolean;

  joinedGroups: string[];
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;

  donations: Donation[];
  addDonation: (donation: Donation) => void;

  scheduleFilter: {
    day: string | null;
    type: string | null;
  };
  setScheduleFilter: (filter: Partial<AppState['scheduleFilter']>) => void;

  groupDistrictFilter: string | null;
  setGroupDistrictFilter: (district: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: 'Гость',
      setUserName: (name) => set({ userName: name }),

      registeredEvents: [],
      registerForEvent: (eventId) =>
        set((s) => ({
          registeredEvents: [...s.registeredEvents, eventId],
        })),
      unregisterFromEvent: (eventId) =>
        set((s) => ({
          registeredEvents: s.registeredEvents.filter((id) => id !== eventId),
        })),
      isRegistered: (eventId) => get().registeredEvents.includes(eventId),

      joinedGroups: [],
      joinGroup: (groupId) =>
        set((s) => ({ joinedGroups: [...s.joinedGroups, groupId] })),
      leaveGroup: (groupId) =>
        set((s) => ({
          joinedGroups: s.joinedGroups.filter((id) => id !== groupId),
        })),

      donations: [],
      addDonation: (donation) =>
        set((s) => ({ donations: [...s.donations, donation] })),

      scheduleFilter: { day: null, type: null },
      setScheduleFilter: (filter) =>
        set((s) => ({
          scheduleFilter: { ...s.scheduleFilter, ...filter },
        })),

      groupDistrictFilter: null,
      setGroupDistrictFilter: (district) => set({ groupDistrictFilter: district }),
    }),
    {
      name: 'emmanuil-app-store',
      partialize: (state) => ({
        registeredEvents: state.registeredEvents,
        joinedGroups: state.joinedGroups,
      }),
    }
  )
);
