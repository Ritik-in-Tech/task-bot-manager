
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import type { RootState } from "../store";
import MainLayout from "../components/MainLayout";

const statusColorMap: Record<string, string> = {
  idle: "bg-muted text-muted-foreground",
  busy: "bg-accent text-accent-foreground",
  charging: "bg-primary text-primary-foreground",
  error: "bg-destructive text-white",
};

const BotStatusPage: React.FC = () => {

  const bots = useSelector((state: RootState) => state.bots.bots);



  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Bot Status
      </h1>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {bots.map((bot) => (
          <motion.div
            key={bot.id}
            variants={item}
            className="rounded-xl bg-card p-5 shadow-lg flex flex-col gap-4 items-center min-w-[180px] transition-all hover:shadow-xl hover:scale-[1.03] hover:border-primary/50 border border-white/10 backdrop-blur-sm cursor-pointer"
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
                {Math.floor(bot.battery)}%
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
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-8 text-xs text-muted-foreground text-center">Bot data auto-updates every 10 seconds (simulated)</div>
    </MainLayout>
  );
};

export default BotStatusPage;
