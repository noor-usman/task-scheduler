import express from 'express';
import db from './../db/client';
import cronParser from 'cron-parser';
import { Request, Response } from 'express';
import { ParsedQs } from 'qs';

const router = express.Router();

interface Task {
  id: string;
  name: string;
  type: string;
  schedule: string;
  nextExecutionTime: number;
}

router.post('/add', (req, res) => {
  const { name, type, schedule } = req.body;
  const id = Date.now().toString();
  console.log("Adding task " + id);

  let nextExecutionTime: number;
  if (type === 'recurring') {
    try {
      const interval = cronParser.parseExpression(schedule);
      nextExecutionTime = interval.next().getTime();
    } catch (err) {
      return res.status(400).send({ error: 'Invalid cron expression' });
    }
  } else {
    nextExecutionTime = new Date(schedule).getTime();
  }

  db.run(
    "INSERT INTO tasks (id, name, type, schedule, status, nextExecutionTime) VALUES (?, ?, ?, ?, 'Not Done', ?)",
    [id, name, type, schedule, nextExecutionTime],
    (err) => {
      if (err) return res.status(500).send(err.message);
      res.status(201).send({ id });
    }
  );
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, schedule } = req.body;
  console.log("Adding edit " + id);

  let nextExecutionTime: number;
  if (type === 'recurring') {
    try {
      const interval = cronParser.parseExpression(schedule);
      nextExecutionTime = interval.next().getTime();
    } catch (err) {
      return res.status(400).send({ error: 'Invalid cron expression' });
    }
  } else {
    nextExecutionTime = new Date(schedule).getTime();
  }

  db.run(
    "UPDATE tasks SET name = ?, type = ?, schedule = ?, nextExecutionTime = ? WHERE id = ?",
    [name, type, schedule, nextExecutionTime, id],
    (err) => {
      if (err) return res.status(500).send(err.message);
      res.sendStatus(204);
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log("Deleting task " + id);
  db.run("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(204);
  });
});

router.get('/all', (req, res) => {
    console.log("Geting all tasks");
  db.all("SELECT * FROM tasks WHERE status != 'Done'", (err, rows: Task[]) => {
    if (err) return res.status(500).send(err.message);
    res.send(rows);
  });
  
});


router.get('/by-ids', (req: Request, res: Response) => {
  const idsParam = req.query.ids as string;


  // Convert idsParam to a string if it's an array or ParsedQs
  let idsStr: string;
  if (Array.isArray(idsParam)) {
    idsStr = idsParam.join(',');
  } else if (typeof idsParam === 'object') {
    idsStr = Object.values(idsParam).join(',');
  } else {
    idsStr = idsParam;
  }

  // Parse IDs correctly
  const ids = idsStr.split(',').map((id: string) => id.trim());

  if (ids.length === 0) {
    return res.status(400).send({ error: 'No valid task IDs provided' });
  }

  console.log("Parsed IDs:", ids);
  const placeholders = ids.map(() => '?').join(',');
  const query = `SELECT * FROM tasks WHERE id IN (${placeholders})`;

  console.log("Query:", query);
  console.log("Query Parameters:", ids);

  db.all(query, ids, (err, rows) => {
    if (err) {
      console.error(`Failed to fetch tasks by IDs: ${err.message}`);
      return res.status(500).send({ error: 'Internal server error' });
    }
    if (rows.length === 0) {
      console.log("No task found!", rows);
      return res.status(404).send({ error: 'No tasks found' });
    }
    console.log(rows);
    res.send(rows);
  });
});




router.get('/logs', (req, res) => {
    console.log("Geting task logs");
  db.all("SELECT * FROM logs ", (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.send(rows);
  });
});

export default router;
