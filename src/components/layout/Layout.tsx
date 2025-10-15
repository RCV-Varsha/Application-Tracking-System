import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { RecruiterHeader } from '../recruiter/RecruiterHeader';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

export const Layout: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {user?.role === 'recruiter' ? <RecruiterHeader /> : <Header />}

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};