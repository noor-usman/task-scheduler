import express from 'express';
import taskRouter from './controllers/taskManager';
import cors from 'cors';
import './taskExecution/taskWorker';

const corsOptions = {
  origin: ['http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
};

const app = express();
app.use(express.json());

app.use(cors());

// Mount the task router
app.use('/task', taskRouter);

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Task Scheduler Service running on port ${port}`);
});
