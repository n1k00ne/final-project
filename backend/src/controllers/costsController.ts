import { Request, Response } from 'express';
import { COSTS } from '../data/mockData';
import { Cost } from '../types';

let costs: Cost[] = [...COSTS];

export const getCosts = (req: Request, res: Response) => {
  res.json(costs);
};

export const getCostById = (req: Request, res: Response) => {
  const { id } = req.params;
  const cost = costs.find(c => c.id === id);
  if (!cost) {
    return res.status(404).json({ error: 'Cost not found' });
  }
  res.json(cost);
};

export const createCost = (req: Request, res: Response) => {
  const newCost: Cost = {
    id: Date.now().toString(),
    ...req.body,
  };
  costs.push(newCost);
  res.status(201).json(newCost);
};

export const updateCost = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = costs.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Cost not found' });
  }
  costs[index] = { ...costs[index], ...req.body };
  res.json(costs[index]);
};

export const deleteCost = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = costs.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Cost not found' });
  }
  costs.splice(index, 1);
  res.status(204).send();
};
