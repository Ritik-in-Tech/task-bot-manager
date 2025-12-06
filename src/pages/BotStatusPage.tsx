
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { updateBots } from "../slices/botsSlice";
import MainLayout from "../components/MainLayout";

const statusColorMap: Record<string, string> = {
  idle: "bg-muted text-muted-foreground",
  busy: "bg-accent text-accent-foreground",
  charging: "bg-primary text-primary-foreground",
  error: "bg-destructive text-white",
};

const BotStatusPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bots = useSelector((state: RootState) => state.bots.bots);

  useEffect(() => {
    // Update bots every 10s
    const timer = setInterval(() => {
      dispatch(updateBots());
    }, 10000);
    return () => clearInterval(timer);
  }, [dispatch]);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-8 text-center">Bot Status</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {bots.map((bot) => (
          <div
            key={bot.id}
            className="rounded-xl bg-card p-5 shadow flex flex-col gap-4 items-center min-w-[180px] transition-all hover:shadow-lg hover:scale-[1.03] hover:border-primary/50 border border-transparent cursor-pointer focus-within:shadow-lg focus-within:scale-[1.03] focus-within:border-primary/80"
            tabIndex={0}
          >
            <div className="flex w-full justify-between items-center mb-1">
              <span className="font-semibold">Bot #{bot.id}</span>
              <span
                className={`inline-block text-xs rounded px-2 py-1 ${statusColorMap[bot.status]}`}
              >
                {bot.status}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-muted-foreground">Battery</span>
              <span className={`font-semibold ${
                bot.battery > 50
                  ? "text-green-600"
                  : bot.battery > 20
                  ? "text-yellow-600"
                  : "text-destructive"
              }`}>
                {bot.battery}%
              </span>
            </div>
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-muted-foreground">Task</span>
              <span className="font-medium text-right line-clamp-1">{bot.currentTask || "-"}</span>
            </div>
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-muted-foreground">Speed</span>
              <span className="font-medium">{bot.speed} m/s</span>
            </div>
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-muted-foreground">Last Updated</span>
              <span className="text-xs font-mono">{bot.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-xs text-muted-foreground text-center">Bot data auto-updates every 10 seconds (simulated)</div>
    </MainLayout>
  );
};

export default BotStatusPage;
