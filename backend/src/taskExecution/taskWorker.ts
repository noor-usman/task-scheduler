import db from './../db/client';
import executeTask from './taskExecutor';

interface Task {
    id: string;
    name: string;
    type: string;
    schedule: string;
    status:string;
    nextExecutionTime: number;
  }

const checkAndExecuteTasks = () => {
  const currentTime = Date.now();
  db.all("SELECT * FROM tasks WHERE nextExecutionTime <= ? AND status != 'Done'", [currentTime], (err, rows:Task[]) => {
    if (err) {
      console.error(`Failed to fetch tasks: ${err.message}`);
      return;
    }
    console.log("Rows: ", rows)

    rows.forEach((task) => {
      executeTask(task);
    });
  });
};

setInterval(checkAndExecuteTasks, 10000);
