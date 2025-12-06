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

function getRandomBot(id: number): Bot {
  const statuses: BotStatus[] = ["idle", "busy", "charging", "error"];
  return {
    id,
    battery: Math.floor(Math.random() * 101),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    currentTask:
      Math.random() > 0.5 ? `Task #${Math.ceil(Math.random() * 10)}` : "",
    speed: Math.round(Math.random() * 5 * 10) / 10, // 0–5 m/s
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

const initialState: BotsState = {
  bots: Array.from({ length: 10 }, (_, i) => getRandomBot(i + 1)),
};

const botsSlice = createSlice({
  name: "bots",
  initialState,
  reducers: {
    updateBots(state) {
      state.bots = state.bots.map((bot) => getRandomBot(bot.id));
    },
    setBots(state, action: PayloadAction<Bot[]>) {
      state.bots = action.payload;
    },
  },
});

export const { updateBots, setBots } = botsSlice.actions;
export default botsSlice.reducer;
