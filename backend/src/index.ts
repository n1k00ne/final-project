import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks';
import costsRouter from './routes/costs';
import categoriesRouter from './routes/categories';
import usersRouter from './routes/users';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/costs', costsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
