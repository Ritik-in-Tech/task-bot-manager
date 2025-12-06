import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import type { RootState } from "../store";
import MainLayout from "../components/MainLayout";

const DashboardPage: React.FC = () => {
  const bots = useSelector((state: RootState) => state.bots.bots);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const totalBots = bots.length;
  const activeTasks = bots.filter((b) => b.status === "busy").length;
  const idleBots = bots.filter((b) => b.status === "idle").length;
  const errorBots = bots.filter((b) => b.status === "error").length;
  const pendingTasks = tasks.length;

  const stats = [
    { label: "Total Bots", value: totalBots, color: "bg-primary/80" },
    { label: "Active Tasks", value: activeTasks, color: "bg-accent/70" },
    { label: "Idle Bots", value: idleBots, color: "bg-muted" },
    { label: "Bots in Error", value: errorBots, color: "bg-destructive/70" },
    { label: "Pending Tasks", value: pendingTasks, color: "bg-secondary/80" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-7 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Dashboard Overview
      </h1>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className={`rounded-xl shadow-lg p-7 flex flex-col gap-2 items-center ${stat.color} backdrop-blur-sm border border-white/10 hover:shadow-xl transition-all hover:-translate-y-1`}
          >
            <span className="text-lg font-medium text-foreground/80">{stat.label}</span>
            <span className="text-3xl font-bold">{stat.value}</span>
          </motion.div>
        ))}
      </motion.div>
    </MainLayout>
  );
};

export default DashboardPage;
