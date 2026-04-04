import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Star, Heart, Menu } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useT } from '@/i18n/translations';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();

  const tabs = [
    { path: '/', icon: Home, label: t.nav.home },
    { path: '/schedule', icon: Calendar, label: t.nav.schedule },
    { path: '/events', icon: Star, label: t.nav.events },
    { path: '/donate', icon: Heart, label: t.nav.donate },
    { path: '/more', icon: Menu, label: t.nav.more },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`nav-item ${isActive(tab.path) ? 'nav-item--active' : ''}`}
          onClick={() => {
            hapticFeedback('light');
            navigate(tab.path);
          }}
        >
          <tab.icon size={22} strokeWidth={isActive(tab.path) ? 2.2 : 1.8} />
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
