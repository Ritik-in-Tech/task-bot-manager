
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { addTask } from "../slices/tasksSlice";
import type { AppDispatch } from "../store";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import MainLayout from "../components/MainLayout";

const TaskSchema = z.object({
  pickup: z.string().min(2, "Required"),
  drop: z.string().min(2, "Required"),
  priority: z.enum(["Low", "Medium", "High"]),
  comments: z.string().optional(),
});

type TaskSchemaType = z.infer<typeof TaskSchema>;

const TaskAllocationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<TaskSchemaType>({
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
      })
    );
    reset({ pickup: "", drop: "", priority: "Medium", comments: "" });
    window.alert("Task added to queue!");
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-8 text-center">Task Allocation</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full mx-auto bg-card p-6 md:p-8 rounded-xl shadow flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label>Pickup Location</label>
          <Input {...register("pickup")}
            placeholder="Enter pickup point"
            autoComplete="off"
          />
          {errors.pickup && (
            <span className="text-xs text-destructive">{errors.pickup.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label>Drop Location</label>
          <Input {...register("drop")}
            placeholder="Enter drop point"
            autoComplete="off"
          />
          {errors.drop && (
            <span className="text-xs text-destructive">{errors.drop.message}</span>
          )}
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
          {errors.priority && (
            <span className="text-xs text-destructive">{errors.priority.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label>Comments</label>
          <Input {...register("comments")} placeholder="Any additional notes" autoComplete="off" />
        </div>
        <Button type="submit" className="mt-2">Add Task</Button>
        {isSubmitSuccessful && (
          <span className="text-green-600 text-sm pt-2">Task successfully added!</span>
        )}
      </form>
    </MainLayout>
  );
};

export default TaskAllocationPage;
