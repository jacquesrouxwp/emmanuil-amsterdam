import { useState, useEffect } from 'react';
import { isTelegramEnv } from '@/lib/telegram';

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Always mobile inside Telegram
    if (isTelegramEnv()) {
      setIsDesktop(false);
      return;
    }

    // Desktop = wide screen AND mouse pointer (not touch).
    // Android tablets in landscape are >= 900px but have pointer:coarse → stay mobile.
    const check = () => {
      const wide = window.innerWidth >= 1100;
      const fine = window.matchMedia('(pointer: fine)').matches;
      setIsDesktop(wide && fine);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}
