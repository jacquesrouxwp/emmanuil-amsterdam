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

    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}
