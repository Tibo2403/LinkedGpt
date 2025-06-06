import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Messages from './pages/Messages';
import ReceivedMessages from './pages/ReceivedMessages';
import History from './pages/History';
import CVGenerator from './pages/CVGenerator';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <MainLayout>
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
    </MainLayout>
  );
}

export default App;
