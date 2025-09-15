'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import LoginPage from './login/page';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
