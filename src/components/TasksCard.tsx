import React, { useState } from 'react';
import Card, { CardHeader, CardContent } from './Card';
import { CheckCircle2, Circle, ChevronRight, Clock, PlusCircle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

const TasksCard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Complete dashboard redesign', completed: true, dueDate: 'Today', priority: 'high' },
    { id: 2, title: 'Prepare presentation for client', completed: false, dueDate: 'Tomorrow', priority: 'high' },
    { id: 3, title: 'Review analytics report', completed: false, dueDate: 'Next week', priority: 'medium' },
    { id: 4, title: 'Finalize project timeline', completed: false, priority: 'medium' },
    { id: 5, title: 'Fix navigation menu bug', completed: false, priority: 'low' },
  ]);

  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const priorityColorMap = {
    low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  return (
    <Card>
      <CardHeader 
        title="Tasks" 
        subtitle="Your team's pending tasks"
        action={
          <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <PlusCircle size={18} />
          </button>
        }
      />
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {tasks.map((task) => (
            <li 
              key={task.id} 
              className={`
                px-5 py-3 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150
                ${task.completed ? 'opacity-60' : ''}
              `}
            >
              <button 
                onClick={() => handleToggleTask(task.id)}
                className="mr-3 flex-shrink-0 focus:outline-none"
              >
                {task.completed ? (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                ) : (
                  <Circle size={20} className="text-gray-300 dark:text-gray-600" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`
                  text-sm font-medium text-gray-900 dark:text-white truncate
                  ${task.completed ? 'line-through' : ''}
                `}>
                  {task.title}
                </p>
                {task.dueDate && (
                  <div className="flex items-center mt-1">
                    <Clock size={12} className="text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due {task.dueDate}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3 flex items-center">
                <span className={`
                  text-xs px-2 py-1 rounded-full 
                  ${priorityColorMap[task.priority]}
                `}>
                  {task.priority}
                </span>
                <ChevronRight size={16} className="ml-3 text-gray-400" />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TasksCard;