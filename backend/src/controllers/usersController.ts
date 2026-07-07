import { Request, Response } from 'express';
import { USERS } from '../data/mockData';

export const getUsers = (req: Request, res: Response) => {
  res.json(USERS);
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  const user = USERS.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};
