import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { useContacts } from '@/hooks/useContacts';
import { useProperties } from '@/hooks/useProperties';
import { useTasks } from '@/hooks/useTasks';
import { useEvents } from '@/hooks/useEvents';
import { formatDate, formatTime, isDueSoon, isOverdue } from '@/utils/dateHelpers';

const Dashboard = () => {
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts();
  const { properties, loading: propertiesLoading, error: propertiesError } = useProperties();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { events, loading: eventsLoading, error: eventsError } = useEvents();

  const [dashboardData, setDashboardData] = useState({
    totalContacts: 0,
    newLeads: 0,
    activeProperties: 0,
    pendingTasks: 0,
    recentActivities: [],
    upcomingEvents: [],
    dueTasks: []
  });

  const loading = contactsLoading || propertiesLoading || tasksLoading || eventsLoading;
  const error = contactsError || propertiesError || tasksError || eventsError;

  useEffect(() => {
    if (!loading && !error) {
      const newLeads = contacts.filter(c => c.stage === 'new').length;
      const activeProperties = properties.filter(p => p.status === 'available').length;
      const pendingTasks = tasks.filter(t => !t.completed).length;
      
      // Get today's events
      const today = new Date().toISOString().split('T')[0];
      const upcomingEvents = events
        .filter(e => e.start.includes(today))
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 5);

      // Get due tasks
      const dueTasks = tasks
        .filter(t => !t.completed && (isDueSoon(t.dueDate) || isOverdue(t.dueDate)))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

      // Recent activities (latest contacts)
      const recentActivities = contacts
        .sort((a, b) => new Date(b.lastContact) - new Date(a.lastContact))
        .slice(0, 5);

      setDashboardData({
        totalContacts: contacts.length,
        newLeads,
        activeProperties,
        pendingTasks,
        recentActivities,
        upcomingEvents,
        dueTasks
      });
    }
  }, [contacts, properties, tasks, events, loading, error]);

  if (loading) return <Loading type="default" />;
  if (error) return <Error title="Dashboard Error" message={error} />;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-neutral-600">
            Welcome back! Here's what's happening with your real estate business today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button variant="secondary" icon="Download" size="sm">
            Export Report
          </Button>
          <Button variant="primary" icon="Plus" size="sm">
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Contacts"
            value={dashboardData.totalContacts}
            change="+12%"
            trend="up"
            icon="Users"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="New Leads"
            value={dashboardData.newLeads}
            change="+8%"
            trend="up"
            icon="UserPlus"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Active Properties"
            value={dashboardData.activeProperties}
            change="-3%"
            trend="down"
            icon="Building2"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Pending Tasks"
            value={dashboardData.pendingTasks}
            change="+5"
            trend="neutral"
            icon="CheckSquare"
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold font-display text-neutral-900">
                Recent Activities
              </h3>
              <Button variant="ghost" size="sm" icon="ExternalLink">
                View All
              </Button>
            </div>
            
            {dashboardData.recentActivities.length === 0 ? (
              <Empty
                icon="Activity"
                title="No recent activities"
                message="Contact activities will appear here."
              />
            ) : (
              <div className="space-y-4">
                {dashboardData.recentActivities.map((contact) => (
                  <div key={contact.Id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Last contact: {formatDate(contact.lastContact)}
                      </p>
                    </div>
                    <Badge variant={contact.stage}>{contact.stage}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold font-display text-neutral-900">
                Today's Schedule
              </h3>
              <Button variant="ghost" size="sm" icon="Calendar">
                View Calendar
              </Button>
            </div>
            
            {dashboardData.upcomingEvents.length === 0 ? (
              <Empty
                icon="Calendar"
                title="No events today"
                message="Your schedule is clear for today."
              />
            ) : (
              <div className="space-y-4">
                {dashboardData.upcomingEvents.map((event) => (
                  <div key={event.Id} className="flex items-start space-x-4 p-3 rounded-lg border border-neutral-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
                      <ApperIcon 
                        name={event.type === 'showing' ? 'Home' : event.type === 'meeting' ? 'Users' : 'Phone'} 
                        className="w-5 h-5 text-accent-600" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        {event.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatTime(event.start)} - {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Due Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold font-display text-neutral-900">
                Due Tasks
              </h3>
              <Button variant="ghost" size="sm" icon="CheckSquare">
                View All
              </Button>
            </div>
            
            {dashboardData.dueTasks.length === 0 ? (
              <Empty
                icon="CheckSquare"
                title="No due tasks"
                message="All caught up! Great work."
              />
            ) : (
              <div className="space-y-4">
                {dashboardData.dueTasks.map((task) => (
                  <div key={task.Id} className="flex items-start space-x-4 p-3 rounded-lg border border-neutral-200">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      isOverdue(task.dueDate) ? 'bg-red-500' : 
                      isDueSoon(task.dueDate) ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        {task.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Due: {formatDate(task.dueDate)}
                      </p>
                      {task.relatedContact && (
                        <p className="text-xs text-primary-600 mt-1">
                          {task.relatedContact}
                        </p>
                      )}
                    </div>
                    <Badge variant={task.priority}>{task.priority}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <h3 className="text-lg font-semibold font-display text-neutral-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="primary"
              icon="UserPlus"
              className="flex-col h-20 space-y-2"
            >
              <span className="text-sm font-medium">Add Contact</span>
            </Button>
            <Button
              variant="secondary"
              icon="Building2"
              className="flex-col h-20 space-y-2"
            >
              <span className="text-sm font-medium">List Property</span>
            </Button>
            <Button
              variant="accent"
              icon="Calendar"
              className="flex-col h-20 space-y-2"
            >
              <span className="text-sm font-medium">Schedule Showing</span>
            </Button>
            <Button
              variant="ghost"
              icon="Plus"
              className="flex-col h-20 space-y-2 border-2 border-dashed border-neutral-300 hover:border-primary-400"
            >
              <span className="text-sm font-medium">Create Task</span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;