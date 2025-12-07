import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import MainLayout from "../components/MainLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { addTask } from "../slices/tasksSlice";
import type { AppDispatch } from "../store";

const TaskSchema = z.object({
	pickup: z.string().min(2, "Required"),
	drop: z.string().min(2, "Required"),
	priority: z.enum(["Low", "Medium", "High"]),
	comments: z.string().optional(),
});

type TaskSchemaType = z.infer<typeof TaskSchema>;

import { useNavigate } from "react-router-dom";

const TaskAllocationPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { register, handleSubmit, reset } = useForm<TaskSchemaType>({
		resolver: zodResolver(TaskSchema),
		defaultValues: { priority: "Medium" },
	});

	const onSubmit = (data: TaskSchemaType) => {
		dispatch(
			addTask({
				pickup: data.pickup,
				drop: data.drop,
				priority: data.priority,
				comments: data.comments ?? "",
			}),
		);
		reset({ pickup: "", drop: "", priority: "Medium", comments: "" });
		navigate("/task-queue");
	};

	const handleBulkCreate = () => {
		const locations = [
			"Zone A",
			"Zone B",
			"Zone C",
			"Dock 1",
			"Dock 2",
			"Shelf 101",
			"Shelf 202",
		];
		for (let i = 0; i < 5; i++) {
			const pickup = locations[Math.floor(Math.random() * locations.length)];
			const drop = locations[Math.floor(Math.random() * locations.length)];
			const priorities: Array<"Low" | "Medium" | "High"> = [
				"Low",
				"Medium",
				"High",
			];
			const priority =
				priorities[Math.floor(Math.random() * priorities.length)];

			dispatch(
				addTask({
					pickup,
					drop,
					priority,
					comments: "Auto-generated task",
				}),
			);
		}
		navigate("/task-queue");
	};

	const onError = () => {
		toast.error("Please fill in all required fields");
	};

	return (
		<MainLayout>
			<h1 className="text-2xl font-bold mb-8 text-center">Task Allocation</h1>
			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className="max-w-md w-full mx-auto bg-card p-6 md:p-8 rounded-xl shadow flex flex-col gap-5"
			>
				<div className="flex flex-col gap-2">
					<label>Pickup Location</label>
					<Input
						{...register("pickup")}
						placeholder="Enter pickup point"
						autoComplete="off"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label>Drop Location</label>
					<Input
						{...register("drop")}
						placeholder="Enter drop point"
						autoComplete="off"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label>Priority</label>
					<select
						{...register("priority")}
						className="border rounded p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<option value="Low">Low</option>
						<option value="Medium">Medium</option>
						<option value="High">High</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label>Comments</label>
					<Input
						{...register("comments")}
						placeholder="Any additional notes"
						autoComplete="off"
					/>
				</div>
				<div className="flex flex-col gap-3 mt-2">
					<Button type="submit" className="w-full">
						Add Task
					</Button>
					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={handleBulkCreate}
					>
						Generate 5 Random Tasks
					</Button>
				</div>
			</form>
		</MainLayout>
	);
};

export default TaskAllocationPage;
