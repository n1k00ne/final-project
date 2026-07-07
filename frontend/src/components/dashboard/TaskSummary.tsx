import React, { useState } from 'react';
import { Task } from '../../types';
import { USERS } from '../../mockData';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface TaskSummaryProps {
  tasks: Task[];
  onToggleTask?: (taskId: string) => void;
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks, onToggleTask }) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  const total = localTasks.length;
  const done = localTasks.filter(t => t.status === 'done').length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  const handleToggle = (taskId: string) => {
    // В реальном приложении вызвали бы API, здесь просто меняем статус локально
    setLocalTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'done' ? 'work' : 'done' }
          : task
      )
    );
    if (onToggleTask) onToggleTask(taskId);
  };

  // Сортируем: сначала невыполненные, потом по дедлайну
  const sorted = [...localTasks].sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (a.status !== 'done' && b.status === 'done') return -1;
    return new Date(a.deadline || 0).getTime() - new Date(b.deadline || 0).getTime();
  });

  return (
    <div className="task-summary">
      <div className="task-progress">
        <span className="progress-label">Выполнено: {done} из {total}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ul className="task-list">
        {sorted.slice(0, 5).map(task => {
          const assignee = USERS[task.assigneeId as keyof typeof USERS];
          const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';
          return (
            <li key={task.id} className={`task-item ${task.status === 'done' ? 'done' : ''} ${isOverdue ? 'overdue' : ''}`}>
              <button className="task-toggle" onClick={() => handleToggle(task.id)}>
                {task.status === 'done' ? <FaCheckCircle color="#27ae60" /> : <FaRegCircle color="#bdc3c7" />}
              </button>
              <span className="task-title">{task.title}</span>
              {assignee && <span className="task-assignee">{assignee.avatar} {assignee.name}</span>}
              {task.deadline && (
                <span className={`task-deadline ${isOverdue ? 'overdue' : ''}`}>
                  {new Date(task.deadline).toLocaleDateString('ru-RU')}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {sorted.length > 5 && <div className="task-more">… и ещё {sorted.length - 5} задач</div>}
    </div>
  );
};

export default TaskSummary;