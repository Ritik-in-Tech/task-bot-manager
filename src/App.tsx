import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BotStatusPage from './pages/BotStatusPage';
import TaskAllocationPage from './pages/TaskAllocationPage';
import TaskQueuePage from './pages/TaskQueuePage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapPage from './pages/MapPage';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bot-status" element={<BotStatusPage />} />
          <Route path="/task-allocation" element={<TaskAllocationPage />} />
          <Route path="/task-queue" element={<TaskQueuePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/map" element={<MapPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;