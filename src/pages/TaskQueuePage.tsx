
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import MainLayout from "../components/MainLayout";

const TaskQueuePage: React.FC = () => {

  const tasks = useSelector((state: RootState) => state.tasks.tasks);




  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-8 text-center">Task Queue</h1>
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <span className="text-xl font-semibold mb-2">No pending tasks!</span>
          <span className="text-sm">(Add tasks from the Task Allocation page)</span>
        </div>
      ) : (
        <div className="flex flex-col gap-5 max-w-2xl w-full mx-auto">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className={`rounded-lg border bg-card p-5 shadow flex flex-col gap-2 transition-all ${
                idx === 0
                  ? "border-primary/80 shadow-lg scale-[1.02]"
                  : "hover:shadow-md hover:border-muted-foreground/20"
              }`}
            >
              <div className="flex gap-3 justify-between text-sm">
                <span className="font-bold text-primary/90">{task.pickup} → {task.drop}</span>
                <span className={
                  task.priority === "High" ? "text-red-600 font-semibold" :
                  task.priority === "Medium" ? "text-yellow-500" : "text-green-600"
                }>{task.priority}</span>
              </div>
              {task.comments && (
                <div className="text-xs text-muted-foreground italic">Comment: {task.comments}</div>
              )}
              <div className="text-xs text-right text-muted-foreground">
                Created: {new Date(task.createdAt).toLocaleString()}
                {idx === 0 ? <span className="ml-2 text-xs text-primary font-bold">(dispatching...)</span> : null}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-center text-sm text-muted-foreground">A task is assigned from the queue every 3 seconds</div>
    </MainLayout>
  );
};

export default TaskQueuePage;
