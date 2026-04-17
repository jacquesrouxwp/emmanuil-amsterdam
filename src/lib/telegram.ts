const tg = window.Telegram?.WebApp;

export function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();
  applyTelegramTheme();
}

export function getTelegramUser() {
  return tg?.initDataUnsafe?.user;
}

export function getUserName(): string {
  const user = getTelegramUser();
  if (!user) return 'Гость';
  return user.first_name || user.username || 'Гость';
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
  tg?.HapticFeedback?.impactOccurred(type);
}

export function hapticNotification(type: 'error' | 'success' | 'warning' = 'success') {
  tg?.HapticFeedback?.notificationOccurred(type);
}

export function showMainButton(text: string, onClick: () => void) {
  if (!tg?.MainButton) return;
  tg.MainButton.setText(text);
  tg.MainButton.onClick(onClick);
  tg.MainButton.show();
}

export function hideMainButton() {
  tg?.MainButton?.hide();
}

export function showBackButton(onClick: () => void) {
  if (!tg?.BackButton) return;
  tg.BackButton.onClick(onClick);
  tg.BackButton.show();
}

export function hideBackButton() {
  tg?.BackButton?.hide();
}

export function openTelegramLink(url: string) {
  tg?.openTelegramLink(url);
}

export function openLink(url: string) {
  if (tg) {
    tg.openLink(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function shareUrl(url: string, text?: string) {
  if (tg) {
    const shareLink = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || '')}`;
    tg.openTelegramLink(shareLink);
  } else if (navigator.share) {
    navigator.share({ url, text }).catch(() => {});
  } else {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || '')}`, '_blank', 'noopener,noreferrer');
  }
}

function applyTheme(isDark: boolean) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

function applyTelegramTheme() {
  if (tg?.themeParams) {
    const root = document.documentElement;
    const tp = tg.themeParams;
    if (tp.bg_color) root.style.setProperty('--tg-bg', tp.bg_color);
    if (tp.text_color) root.style.setProperty('--tg-text', tp.text_color);
    if (tp.hint_color) root.style.setProperty('--tg-hint', tp.hint_color);
    if (tp.link_color) root.style.setProperty('--tg-link', tp.link_color);
    if (tp.button_color) root.style.setProperty('--tg-button', tp.button_color);
    if (tp.button_text_color) root.style.setProperty('--tg-button-text', tp.button_text_color);
    if (tp.secondary_bg_color) root.style.setProperty('--tg-secondary-bg', tp.secondary_bg_color);
    applyTheme(tg.colorScheme === 'dark');
  } else {
    // Web browser: use system preference
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(mq.matches);
    mq.addEventListener('change', (e) => applyTheme(e.matches));
  }
}

export function isTelegramEnv(): boolean {
  return !!tg?.initData;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        enableClosingConfirmation: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        MainButton: {
          setText: (text: string) => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        BackButton: {
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: string) => void;
          notificationOccurred: (type: string) => void;
          selectionChanged: () => void;
        };
        openLink: (url: string) => void;
        openTelegramLink: (url: string) => void;
      };
    };
  }
}
