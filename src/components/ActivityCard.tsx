import React from 'react';
import Card, { CardHeader, CardContent } from './Card';
import { CheckCircle as CircleCheck, AlertCircle, Clock, FileEdit, User, MessageSquare, FileText } from 'lucide-react';

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'pending';
  icon: 'user' | 'message' | 'edit' | 'document';
}

const iconMap = {
  user: <User size={14} />,
  message: <MessageSquare size={14} />,
  edit: <FileEdit size={14} />,
  document: <FileText size={14} />
};

const statusIconMap = {
  success: <CircleCheck size={16} className="text-emerald-500" />,
  warning: <AlertCircle size={16} className="text-amber-500" />,
  info: <FileEdit size={16} className="text-blue-500" />,
  pending: <Clock size={16} className="text-gray-400" />
};

const typeColorMap = {
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  pending: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
};

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex">
          <div className="mr-3 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeColorMap[activity.type]}`}>
              {iconMap[activity.icon]}
            </div>
            {activity.id !== activities[activities.length - 1].id && (
              <div className="w-px h-full bg-gray-200 dark:bg-gray-700 my-2" />
            )}
          </div>
          <div className="pb-4">
            <div className="flex items-center">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </h4>
              <div className="ml-2">
                {statusIconMap[activity.type]}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {activity.description}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
              {activity.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ActivityCard: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: 1,
      title: 'New team member added',
      description: 'Sarah Johnson joined the Design team',
      time: '2 hours ago',
      type: 'success',
      icon: 'user'
    },
    {
      id: 2,
      title: 'New comment on "Q2 Planning"',
      description: 'David left a comment on the document',
      time: '4 hours ago',
      type: 'info',
      icon: 'message'
    },
    {
      id: 3,
      title: 'Project deadline updated',
      description: 'Website redesign deadline changed to next week',
      time: 'Yesterday at 4:30 PM',
      type: 'warning',
      icon: 'edit'
    },
    {
      id: 4,
      title: 'New document shared',
      description: 'Marketing strategy document was shared with you',
      time: 'Yesterday at 2:15 PM',
      type: 'info',
      icon: 'document'
    },
    {
      id: 5,
      title: 'Meeting scheduled',
      description: 'Weekly team sync scheduled for tomorrow at 10 AM',
      time: '2 days ago',
      type: 'pending',
      icon: 'edit'
    }
  ];

  return (
    <Card>
      <CardHeader 
        title="Recent Activity" 
        subtitle="Latest activities from your team"
        action={
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            View all
          </button>
        }
      />
      <CardContent>
        <ActivityTimeline activities={activities} />
      </CardContent>
    </Card>
  );
};

export default ActivityCard;