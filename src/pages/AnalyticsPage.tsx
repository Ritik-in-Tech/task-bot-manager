
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import MainLayout from "../components/MainLayout";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const BOT_STATUS_COLORS = {
  idle: "#60A5FA",        // blue-400
  busy: "#F59E42",        // orange-400
  charging: "#34D399",   // green-400
  error: "#EF4444",      // red-500
};
const PRIORITY_COLORS = {
  Low: "#34D399",
  Medium: "#F59E42",
  High: "#EF4444",
};

const AnalyticsPage: React.FC = () => {
  const bots = useSelector((state: RootState) => state.bots.bots);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Pie Data: Bot Status Distribution
  const botStatusCounts = bots.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusPieData = Object.entries(botStatusCounts).map(([key, val]) => ({ name: key, value: val }));

  // Bar Data: Tasks by Priority
  const priorityCounts = tasks.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const priorities: Array<'Low' | 'Medium' | 'High'> = ["Low", "Medium", "High"];
  const priorityBarData = priorities.map((p) => ({ priority: p, count: priorityCounts[p] || 0 }));

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-8 text-center">Analytics & Metrics</h1>
      <div className="flex flex-col lg:flex-row gap-10 justify-center items-center w-full">
        {/* Bot Status Pie Chart */}
        <div className="bg-card rounded-xl p-6 shadow w-full max-w-sm flex flex-col items-center">
          <span className="mb-2 font-semibold text-md text-center">Bot Status Distribution</span>
          {statusPieData.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">No bot data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ value }) => `${value}`}
                >
                  {statusPieData.map((entry) => (
                    <Cell key={entry.name} fill={BOT_STATUS_COLORS[entry.name as keyof typeof BOT_STATUS_COLORS] || "#aaa"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Task Priority Bar Chart */}
        <div className="bg-card rounded-xl p-6 shadow w-full max-w-sm flex flex-col items-center">
          <span className="mb-2 font-semibold text-md text-center">Tasks by Priority</span>
          {priorityBarData.every(d => d.count === 0) ? (
            <div className="text-muted-foreground text-center py-8">No tasks yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count">
                  {priorityBarData.map((entry) => (
                    <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority as keyof typeof PRIORITY_COLORS] || "#888"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
