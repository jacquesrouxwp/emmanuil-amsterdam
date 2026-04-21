import { useState, useEffect } from 'react';
import { getAdminInfo } from '@/lib/api';

export const ADMIN_SECRET_KEY = 'emmanuil_admin_secret';

/**
 * Returns the admin's churchId ('*' for global founder, slug for per-church admin,
 * or null if not authenticated). Useful to decide whether to show edit controls
 * on a given church profile.
 */
export function useAdminChurch(): { churchId: string | null; isGlobal: boolean; loading: boolean } {
  const [state, setState] = useState<{ churchId: string | null; isGlobal: boolean; loading: boolean }>({
    churchId: null,
    isGlobal: false,
    loading: true,
  });

  useEffect(() => {
    const secret = localStorage.getItem(ADMIN_SECRET_KEY);
    if (!secret) {
      setState({ churchId: null, isGlobal: false, loading: false });
      return;
    }
    let cancelled = false;
    getAdminInfo(secret).then((info) => {
      if (cancelled) return;
      if (!info) {
        setState({ churchId: null, isGlobal: false, loading: false });
      } else {
        setState({ churchId: info.churchId, isGlobal: info.isGlobal, loading: false });
      }
    });
    return () => { cancelled = true; };
  }, []);

  return state;
}

/**
 * Returns true if the current admin can edit content belonging to `churchId`.
 * Global admin can edit any; per-church admin only their own.
 */
export function canEditChurch(adminChurchId: string | null, churchId: string): boolean {
  if (!adminChurchId) return false;
  if (adminChurchId === '*') return true;
  return adminChurchId === churchId;
}
