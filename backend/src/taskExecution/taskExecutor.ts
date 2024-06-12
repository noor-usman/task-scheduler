import cronParser from 'cron-parser';
import db from './../db/client';

interface Task {
  id: string;
  name: string;
  type: string;
  schedule: string;
  status:string;
  nextExecutionTime: number;
}

const executeTask = (task: Task) => {
  console.log(`Executing task: ${task.name}`);

  // Simulate task execution
  const executionTime = Date.now();
  const status = 'success';

  db.run(
    "INSERT INTO logs (taskId, executionTime, status) VALUES (?, ?, ?)",
    [task.id, executionTime, status],
    (err) => {
      if (err) console.error(`Failed to log execution for task ${task.id}: ${err.message}`);
    }
  );

  if (task.type === 'recurring') {
    // Schedule the next execution time for recurring tasks
    try {
      const interval = cronParser.parseExpression(task.schedule);
      const nextExecutionTime = interval.next().getTime();
      db.run(
        "UPDATE tasks SET nextExecutionTime = ? WHERE id = ?",
        [nextExecutionTime, task.id],
        (err) => {
          if (err) console.error(`Failed to update next execution time for task ${task.id}: ${err.message}`);
        }
      );
    } catch (err) {
      if(err instanceof Error){
        console.error(`Failed to parse cron expression for task ${task.id}: ${err.message}`);
      }
      else{
        console.error(`Error: ${task.id}: ${err}`);
      }
    }
  } else {
    // Remove one-time tasks after execution
    db.run(
      "UPDATE tasks SET status = 'Done' WHERE id = ?",
      [task.id],
      (err) => {
        if (err) {
          console.error(`Failed to update task ${task.id}: ${err.message}`);
        } else {
          console.log(`Task ${task.id} status updated to 'Done'`);
        }
      }
    );
    
  }
};

export default executeTask;
