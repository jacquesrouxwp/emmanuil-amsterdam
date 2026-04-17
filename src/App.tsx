import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { DesktopLayout } from '@/components/layout/DesktopLayout';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { HomePage } from '@/pages/HomePage';
import { SchedulePage } from '@/pages/SchedulePage';
import { EventsPage } from '@/pages/EventsPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { DonatePage } from '@/pages/DonatePage';
import { MorePage } from '@/pages/MorePage';
import { VolunteerPage } from '@/pages/VolunteerPage';
import { AdminPage } from '@/pages/AdminPage';
import { BiblePage } from '@/pages/BiblePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/donate" element={<DonatePage />} />
      <Route path="/more" element={<MorePage />} />
      <Route path="/volunteer" element={<VolunteerPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/bible" element={<BiblePage />} />
    </Routes>
  );
}

function MobileShell() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', width: '100%',
      maxWidth: 480, margin: '0 auto', overflow: 'hidden',
    }}>
      <AppRoutes />
      <BottomNav />
    </div>
  );
}

export default function App() {
  const isDesktop = useIsDesktop();

  // Toggle body class so CSS can adapt
  useEffect(() => {
    if (isDesktop) {
      document.body.classList.add('desktop-mode');
    } else {
      document.body.classList.remove('desktop-mode');
    }
  }, [isDesktop]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {isDesktop ? (
        <DesktopLayout>
          <AppRoutes />
        </DesktopLayout>
      ) : (
        <MobileShell />
      )}
    </BrowserRouter>
  );
}
