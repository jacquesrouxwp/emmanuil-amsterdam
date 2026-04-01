import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Star, Heart, Menu } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';

const tabs = [
  { path: '/', icon: Home, label: 'Головна' },
  { path: '/schedule', icon: Calendar, label: 'Розклад' },
  { path: '/events', icon: Star, label: 'Події' },
  { path: '/donate', icon: Heart, label: 'Пожертва' },
  { path: '/more', icon: Menu, label: 'Ще' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

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
