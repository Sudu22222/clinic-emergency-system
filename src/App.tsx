import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { ToastContainer } from './components/common/ToastContainer';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { AppointmentManagement } from './components/appointments/AppointmentManagement';
import { AmbulanceCoordination } from './components/ambulance/AmbulanceCoordination';
import { BloodBankTracker } from './components/bloodBank/BloodBankTracker';
import { HealthcareDirectory } from './components/directory/HealthcareDirectory';
import { AuthModal } from './components/auth/AuthModal';
import { Activity, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, currentUser } = useHealth();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activeTab === 'dashboard' && (
        currentUser?.role === 'patient' ? <PatientDashboard /> : <OverviewDashboard />
      )}
      {activeTab === 'appointments' && <AppointmentManagement />}
      {activeTab === 'ambulance' && <AmbulanceCoordination />}
      {activeTab === 'blood' && <BloodBankTracker />}
      {activeTab === 'directory' && <HealthcareDirectory />}
    </main>
  );
};

const LayoutWrapper: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-teal-600 selection:text-white transition-colors duration-200 relative">
      {/* Visual disclaimer indicator banner */}
      <DisclaimerBanner />

      {/* Unified Non-Overlapping Sticky Top Header Container */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <Header />
        <Navigation />
      </header>

      {/* Main Content Area */}
      <div className="flex-grow">
        <MainContent />
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">HealthPulse</span>
            <span>— Simple Healthcare & Emergency Platform</span>
          </div>

          <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Easy & Secure Healthcare Access</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, authLoading } = useHealth();

  if (authLoading) {
    return <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">Connecting to HealthPulse...</main>;
  }
  return currentUser ? <LayoutWrapper /> : <AuthModal />;
};

export const App: React.FC = () => {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
};

export default App;
