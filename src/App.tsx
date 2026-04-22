import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { WorldPage } from '@/pages/WorldPage';
import { ChurchProfilePage } from '@/pages/ChurchProfilePage';
import { WelcomePage } from '@/pages/WelcomePage';
import { InviteFlowPage } from '@/pages/InviteFlowPage';
import { MyChurchPage } from '@/pages/MyChurchPage';
import { MyChurchProfileEditor } from '@/pages/MyChurchProfileEditor';
import { MyChurchPostsManager } from '@/pages/MyChurchPostsManager';
import { MyChurchEventsManager } from '@/pages/MyChurchEventsManager';
import { MyChurchGroupsManager } from '@/pages/MyChurchGroupsManager';
import { MyChurchInvitePastorPage } from '@/pages/MyChurchInvitePastorPage';
import { MyChurchStatsPage } from '@/pages/MyChurchStatsPage';
import { MinisterAccessPage } from '@/pages/MinisterAccessPage';
import { useUserStore, hasAdminAccess } from '@/store/userStore';

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { onboarded, role } = useUserStore();
  if (!onboarded) return <Navigate to="/welcome" replace />;
  // Visitor has no church — redirect home (/) to world feed
  if (role === 'visitor') return <Navigate to="/world" replace />;
  return <>{children}</>;
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const { onboarded, role } = useUserStore();
  if (!onboarded) return <Navigate to="/welcome" replace />;
  if (!hasAdminAccess(role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Onboarding — no gate */}
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/invite-flow" element={<InviteFlowPage />} />
      <Route path="/invite/:token" element={<InviteFlowPage />} />
      <Route path="/join/:token" element={<MinisterAccessPage />} />

      {/* App — gated behind onboarding */}
      <Route path="/" element={<OnboardingGate><HomePage /></OnboardingGate>} />
      <Route path="/schedule" element={<OnboardingGate><SchedulePage /></OnboardingGate>} />
      <Route path="/events" element={<OnboardingGate><EventsPage /></OnboardingGate>} />
      <Route path="/about" element={<OnboardingGate><AboutPage /></OnboardingGate>} />
      <Route path="/contacts" element={<OnboardingGate><ContactsPage /></OnboardingGate>} />
      <Route path="/donate" element={<OnboardingGate><DonatePage /></OnboardingGate>} />
      <Route path="/more" element={<OnboardingGate><MorePage /></OnboardingGate>} />
      <Route path="/volunteer" element={<OnboardingGate><VolunteerPage /></OnboardingGate>} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/my-church" element={<AdminGate><MyChurchPage /></AdminGate>} />
      <Route path="/my-church/profile" element={<AdminGate><MyChurchProfileEditor /></AdminGate>} />
      <Route path="/my-church/posts" element={<AdminGate><MyChurchPostsManager /></AdminGate>} />
      <Route path="/my-church/events" element={<AdminGate><MyChurchEventsManager /></AdminGate>} />
      <Route path="/my-church/homegroups" element={<AdminGate><MyChurchGroupsManager /></AdminGate>} />
      <Route path="/my-church/invite-pastor" element={<AdminGate><MyChurchInvitePastorPage /></AdminGate>} />
      <Route path="/my-church/stats" element={<AdminGate><MyChurchStatsPage /></AdminGate>} />
      <Route path="/bible" element={<OnboardingGate><BiblePage /></OnboardingGate>} />
      <Route path="/world" element={<OnboardingGate><WorldPage /></OnboardingGate>} />
      <Route path="/church/:id" element={<OnboardingGate><ChurchProfilePage /></OnboardingGate>} />
    </Routes>
  );
}

const NO_NAV_ROUTES = ['/welcome', '/invite-flow', '/invite', '/join', '/my-church'];

function MobileShell() {
  const location = useLocation();
  const hideNav = NO_NAV_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', width: '100%',
      maxWidth: 480, margin: '0 auto', overflow: 'hidden',
    }}>
      <AppRoutes />
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  const isDesktop = useIsDesktop();

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
