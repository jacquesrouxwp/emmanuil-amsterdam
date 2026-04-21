import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'visitor' | 'member' | 'pastor';

interface UserState {
  role: UserRole | null;
  churchId: string | null;
  onboarded: boolean;
  // actions
  setRole: (role: UserRole) => void;
  setChurchId: (id: string) => void;
  completeOnboarding: (role: UserRole, churchId?: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      role: null,
      churchId: null,
      onboarded: false,

      setRole: (role) => set({ role }),
      setChurchId: (id) => set({ churchId: id }),

      completeOnboarding: (role, churchId) =>
        set({ role, churchId: churchId ?? null, onboarded: true }),

      reset: () => set({ role: null, churchId: null, onboarded: false }),
    }),
    { name: 'kairos_user' },
  ),
);
