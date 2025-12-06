import type { AppDispatch, RootState } from "../store";
import { setBots } from "../slices/botsSlice";
import { removeTask } from "../slices/tasksSlice";

export const runSimulationTick = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const bots = [...state.bots.bots]; // Shallow copy to modify
  const tasks = state.tasks.tasks;
  
  let tasksAssignedCount = 0;

  // 1. Process each bot
  const updatedBots = bots.map((originalBot) => {
    const bot = { ...originalBot }; // Copy bot

    // --- Battery & Status Logic ---
    if (bot.status === "charging") {
      bot.battery = Math.min(100, bot.battery + 20);
      bot.speed = 0;
      if (bot.battery >= 50) {
        bot.status = "idle";
      }
    } else if (bot.status === "error") {
      bot.speed = 0;
      if (Math.random() < 0.1) {
        bot.status = "idle";
      }
    } else {
      // Busy or Idle
      if (bot.status === "busy") {
        bot.battery = Math.max(0, bot.battery - 20);
        bot.speed = 3.5;
      } else {
        bot.battery = Math.max(0, bot.battery - 1);
        bot.speed = 0;
      }

      // Low Battery Check
      if (bot.battery <= 20) {
        bot.status = "charging";
        bot.currentTask = "";
      } else if (Math.random() < 0.01) {
        bot.status = "error";
        bot.currentTask = "";
      }
    }

    // --- Task Completion Logic ---
    if (originalBot.status === "busy" && bot.status === "busy") {
      bot.status = "idle";
      bot.currentTask = "";
      bot.speed = 0;
    }

    bot.lastUpdated = new Date().toLocaleTimeString();
    return bot;
  });

  // 2. Assign Tasks to Idle Bots
  const finalBotsWithAssignment = updatedBots.map((bot) => {
     if (bot.status === "idle" && tasksAssignedCount < tasks.length) {
         const task = tasks[tasksAssignedCount];
         tasksAssignedCount++;
         return {
             ...bot,
             status: "busy" as const,
             currentTask: `${task.pickup} -> ${task.drop}`,
             speed: 4.0
         };
     }
     return bot;
  });

  // 3. Dispatch Updates
  dispatch(setBots(finalBotsWithAssignment));
  
  // Remove assigned tasks
  for (let i = 0; i < tasksAssignedCount; i++) {
    dispatch(removeTask());
  }
};
