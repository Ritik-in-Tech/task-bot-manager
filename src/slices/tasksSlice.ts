import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export interface Task {
	id: string;
	pickup: string;
	drop: string;
	priority: "Low" | "Medium" | "High";
	comments?: string;
	createdAt: string;
}

interface TasksState {
	tasks: Task[];
}

const initialState: TasksState = {
	tasks: [],
};

const tasksSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {
		addTask: {
			reducer(state, action: PayloadAction<Task>) {
				state.tasks.push(action.payload);
			},
			prepare(task: Omit<Task, "id" | "createdAt">) {
				return {
					payload: {
						...task,
						id: nanoid(),
						createdAt: new Date().toISOString(),
					},
				};
			},
		},
		removeTask(state) {
			state.tasks.shift();
		},
		clearTasks(state) {
			state.tasks = [];
		},
	},
});

export const { addTask, removeTask, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
