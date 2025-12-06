import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BotStatus = "idle" | "busy" | "charging" | "error";
export interface Bot {
  id: number;
  battery: number; // percentage
  status: BotStatus;
  currentTask: string;
  speed: number;
  lastUpdated: string;
}

interface BotsState {
  bots: Bot[];
}

function getInitialBot(id: number): Bot {
  return {
    id,
    battery: 100,
    status: "idle",
    currentTask: "",
    speed: 0,
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

const initialState: BotsState = {
  bots: Array.from({ length: 10 }, (_, i) => getInitialBot(i + 1)),
};

const botsSlice = createSlice({
  name: "bots",
  initialState,
  reducers: {
    tickBots(state) {
      state.bots.forEach((bot) => {
        // 1. Handle Charging
        if (bot.status === "charging") {
          bot.battery = Math.min(100, bot.battery + 10); // Charge faster
          bot.speed = 0;
          if (bot.battery >= 100) {
            bot.status = "idle";
          }
        } 
        // 2. Handle Error
        else if (bot.status === "error") {
            bot.speed = 0;
            // 10% chance to recover from error per tick
            if (Math.random() < 0.1) {
                bot.status = "idle";
            }
        }
        // 3. Handle Busy/Idle (Battery Drain)
        else {
            if (bot.status === "busy") {
                bot.battery = Math.max(0, bot.battery - 5); // Drain 5% per 10s tick
                bot.speed = 3.5;
            } else {
                // Idle
                bot.speed = 0;
                bot.battery = Math.max(0, bot.battery - 1); // Drain 1% per 10s tick
            }

            // Check for Low Battery -> Force Charging
            if (bot.battery < 20) {
                bot.status = "charging";
                bot.currentTask = ""; // Drop task if any
            }
            // Random Error Chance (e.g., 1% chance per tick if not charging)
            else if (Math.random() < 0.01) {
                bot.status = "error";
                bot.currentTask = "";
            }
        }

        bot.lastUpdated = new Date().toLocaleTimeString();
      });
    },
    assignTaskToBot(state, action: PayloadAction<{ botId: number; taskName: string }>) {
      const bot = state.bots.find((b) => b.id === action.payload.botId);
      if (bot && bot.status === "idle") {
        bot.status = "busy";
        bot.currentTask = action.payload.taskName;
        bot.speed = 4.0;
      }
    },
    completeBotTask(state, action: PayloadAction<{ botId: number }>) {
      const bot = state.bots.find((b) => b.id === action.payload.botId);
      if (bot && bot.status === "busy") {
        bot.status = "idle";
        bot.currentTask = "";
        bot.speed = 0;
      }
    },
    setBots(state, action: PayloadAction<Bot[]>) {
      state.bots = action.payload;
    },
  },
});

export const { tickBots, assignTaskToBot, completeBotTask, setBots } = botsSlice.actions;
export default botsSlice.reducer;
