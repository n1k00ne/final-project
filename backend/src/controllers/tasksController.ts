import { Request, Response } from 'express';
import { TASKS } from '../data/mockData';
import { Task } from '../types';

let tasks: Task[] = [...TASKS];

export const getTasks = (req: Request, res: Response) => {
  console.log("polychili vse taski")
  res.json(tasks);
};

export const getTaskById = (req: Request, res: Response) => {
  console.log("polychili tasky s takim id")
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
};

export const createTask = (req: Request, res: Response) => {
  const newTask: Task = {
    id: Date.now().toString(),
    ...req.body,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
};
