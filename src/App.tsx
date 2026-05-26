import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';

const Posts = React.lazy(() => import('./pages/Posts'));
const Messages = React.lazy(() => import('./pages/Messages'));
const ReceivedMessages = React.lazy(() => import('./pages/ReceivedMessages'));
const History = React.lazy(() => import('./pages/History'));
const CVGenerator = React.lazy(() => import('./pages/CVGenerator'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/received-messages" element={<ReceivedMessages />} />
          <Route path="/history" element={<History />} />
          <Route path="/cv-generator" element={<CVGenerator />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
