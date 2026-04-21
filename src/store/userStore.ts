import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// visitor  — просто дивиться, без церкви
// member   — член конкретної церкви
// minister — служитель: має доступ до адмінки своєї церкви (пости, події, домашки)
// pastor   — пастор: повний доступ + може запрошувати інших пасторів і служителів
export type UserRole = 'visitor' | 'member' | 'minister' | 'pastor';

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

// ── Хелпери перевірки прав ──────────────────────────────────────────────────

/** Чи може редагувати контент церкви (пости, події, домашки) */
export function canEdit(role: UserRole | null): boolean {
  return role === 'pastor' || role === 'minister';
}

/** Чи може запрошувати інших пасторів або керувати служителями */
export function canInvite(role: UserRole | null): boolean {
  return role === 'pastor';
}

/** Чи має доступ до адмінської панелі */
export function hasAdminAccess(role: UserRole | null): boolean {
  return role === 'pastor' || role === 'minister';
}
