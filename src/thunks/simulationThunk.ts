import { setBots } from "../slices/botsSlice";
import { removeTask } from "../slices/tasksSlice";
import type { AppDispatch, RootState } from "../store";

export const runSimulationTick =
	() => (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();
		const bots = [...state.bots.bots];
		const tasks = state.tasks.tasks;

		let tasksAssignedCount = 0;

		const updatedBots = bots.map((originalBot) => {
			const bot = { ...originalBot };

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
				if (bot.status === "busy") {
					bot.battery = Math.max(0, bot.battery - 20);
					bot.speed = 3.5;
				} else {
					bot.battery = Math.max(0, bot.battery - 1);
					bot.speed = 0;
				}

				if (bot.battery <= 20) {
					bot.status = "charging";
					bot.currentTask = "";
				} else if (Math.random() < 0.01) {
					bot.status = "error";
					bot.currentTask = "";
				}
			}

			if (originalBot.status === "busy" && bot.status === "busy") {
				bot.status = "idle";
				bot.currentTask = "";
				bot.speed = 0;
			}

			bot.lastUpdated = new Date().toLocaleTimeString();
			return bot;
		});

		const finalBotsWithAssignment = updatedBots.map((bot) => {
			if (bot.status === "idle" && tasksAssignedCount < tasks.length) {
				const task = tasks[tasksAssignedCount];
				tasksAssignedCount++;
				return {
					...bot,
					status: "busy" as const,
					currentTask: `${task.pickup} -> ${task.drop}`,
					speed: 4.0,
				};
			}
			return bot;
		});

		dispatch(setBots(finalBotsWithAssignment));

		for (let i = 0; i < tasksAssignedCount; i++) {
			dispatch(removeTask());
		}
	};
