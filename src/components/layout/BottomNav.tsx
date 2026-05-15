import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Star, Globe2, MoreHorizontal, Settings, Church, User } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useT } from '@/i18n/translations';
import { useUserStore } from '@/store/userStore';

type Tab = { path: string; icon: React.ElementType; label: string };

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();
  const { role, churchId } = useUserStore();

  let tabs: Tab[];

  if (role === 'pastor' || role === 'minister') {
    tabs = [
      { path: '/', icon: Home, label: t.nav.home },
      { path: '/my-church', icon: Settings, label: 'Моя церква' },
      { path: '/world', icon: Globe2, label: 'Мережа' },
      { path: '/more', icon: MoreHorizontal, label: t.nav.more },
    ];
  } else if (role === 'member' && churchId) {
    tabs = [
      { path: '/', icon: Home, label: t.nav.home },
      { path: '/schedule', icon: Calendar, label: t.nav.schedule },
      { path: '/events', icon: Star, label: t.nav.events },
      { path: `/church/${churchId}`, icon: Church, label: 'Церква' },
      { path: '/more', icon: MoreHorizontal, label: t.nav.more },
    ];
  } else {
    tabs = [
      { path: '/world', icon: Globe2, label: 'Мир' },
      { path: '/events', icon: Star, label: 'Події' },
      { path: '/world', icon: Church, label: 'Церкви' },
      { path: '/more', icon: MoreHorizontal, label: 'Більше' },
    ];
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'rgba(10, 15, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '8px 12px 20px',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'relative'
      }}>
        {tabs.map((tab, index) => {
          const active = isActive(tab.path);
          return (
            <button
              key={index}
              onClick={() => {
                hapticFeedback(active ? 'light' : 'medium');
                navigate(tab.path);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: active ? '8px 18px' : '8px 12px',
                borderRadius: active ? 999 : 12,
                background: active 
                  ? 'linear-gradient(135deg, #5E9ED6, #3A7BC8)' 
                  : 'transparent',
                boxShadow: active 
                  ? '0 4px 20px rgba(94, 158, 214, 0.4)' 
                  : 'none',
                transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                minWidth: active ? 72 : 52,
                position: 'relative'
              }}
            >
              <tab.icon 
                size={active ? 22 : 20} 
                strokeWidth={active ? 2.5 : 2}
                color={active ? 'white' : 'rgba(255,255,255,0.7)'} 
              />
              
              <span style={{
                fontSize: active ? 10 : 9,
                fontWeight: active ? 600 : 500,
                color: active ? 'white' : 'rgba(255,255,255,0.55)',
                letterSpacing: active ? '-0.2px' : '0',
                whiteSpace: 'nowrap'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
