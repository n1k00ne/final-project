import { Request, Response } from 'express';
import { CATEGORIES } from '../data/mockData';

export const getCategories = (req: Request, res: Response) => {
  res.json(CATEGORIES);
};
