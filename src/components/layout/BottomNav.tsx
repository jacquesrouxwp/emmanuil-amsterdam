import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Star, Globe2, MoreHorizontal, Settings, Church, Map } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useT } from '@/i18n/translations';
import { useUserStore } from '@/store/userStore';

type Tab = { path: string; icon: React.ElementType; label: string };

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();
  const { role, churchId } = useUserStore();

  // ── Набір табів залежно від ролі ──────────────────────────────────────────

  let tabs: Tab[];

  if (role === 'pastor' || role === 'minister') {
    // Пастор / служитель — керування + мережа
    tabs = [
      { path: '/',          icon: Home,          label: t.nav.home },
      { path: '/my-church', icon: Settings,       label: 'Моя церква' },
      { path: '/world',     icon: Globe2,         label: 'Мережа' },
      { path: '/more',      icon: MoreHorizontal, label: t.nav.more },
    ];
  } else if (role === 'member' && churchId) {
    // Член церкви — повний набір своєї церкви
    tabs = [
      { path: '/',                    icon: Home,          label: t.nav.home },
      { path: '/schedule',            icon: Calendar,      label: t.nav.schedule },
      { path: '/events',              icon: Star,          label: t.nav.events },
      { path: `/church/${churchId}`,  icon: Church,        label: 'Церква' },
      { path: '/more',                icon: MoreHorizontal, label: t.nav.more },
    ];
  } else {
    // Гість (visitor) або не онбордований — мінімальна навігація без прив'язки до церкви
    tabs = [
      { path: '/world',  icon: Globe2,         label: 'Лента' },
      { path: '/events', icon: Star,           label: 'Події' },
      { path: '/world',  icon: Map,            label: 'Церкви' },  // TODO: окремий /churches каталог
      { path: '/more',   icon: MoreHorizontal, label: 'Більше' },
    ];
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      {tabs.map((tab, i) => (
        <button
          key={`${tab.path}-${i}`}
          className={`nav-item ${isActive(tab.path) ? 'nav-item--active' : ''}`}
          onClick={() => {
            hapticFeedback('light');
            navigate(tab.path);
          }}
        >
          <tab.icon size={26} strokeWidth={isActive(tab.path) ? 2.2 : 1.8} />
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
