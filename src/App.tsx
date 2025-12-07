import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AuthGuard from "./components/AuthGuard";
import { useSimulation } from "./hooks/useSimulation";
import AnalyticsPage from "./pages/AnalyticsPage";
import BotStatusPage from "./pages/BotStatusPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import TaskAllocationPage from "./pages/TaskAllocationPage";
import TaskQueuePage from "./pages/TaskQueuePage";

function App() {
	useSimulation();
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
			<Toaster position="top-center" richColors />
		</BrowserRouter>
	);
}

export default App;
