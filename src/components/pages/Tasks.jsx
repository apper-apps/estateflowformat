import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { useTasks } from '@/hooks/useTasks';
import { filterTasks, sortData } from '@/utils/filterHelpers';
import { formatDateTime, isOverdue, isDueSoon } from '@/utils/dateHelpers';

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 16) : '',
    reminder: task?.reminder ? task.reminder.slice(0, 16) : '',
    priority: task?.priority || 'medium',
    assignedTo: task?.assignedTo || 'John Smith',
    relatedContact: task?.relatedContact || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString(),
      reminder: formData.reminder ? new Date(formData.reminder).toISOString() : null
    };
    onSave(taskData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-display">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <Button variant="ghost" size="sm" icon="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-24"
              placeholder="Add task details..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Due Date & Time"
              type="datetime-local"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            <Input
              label="Reminder"
              type="datetime-local"
              value={formData.reminder}
              onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input
              label="Assigned To"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
          </div>

          <Input
            label="Related Contact"
            value={formData.relatedContact}
            onChange={(e) => setFormData({ ...formData, relatedContact: e.target.value })}
          />

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Tasks = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    completed: undefined
  });

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const statusOptions = [
    { value: 'false', label: 'Pending' },
    { value: 'true', label: 'Completed' }
  ];

  const filteredTasks = useMemo(() => {
    const completedFilter = filters.completed !== undefined ? 
      filters.completed === 'true' : undefined;
    
    const filtered = filterTasks(tasks, {
      ...filters,
      completed: completedFilter
    });
    
    return sortData(filtered, 'dueDate');
  }, [tasks, filters]);

  const taskStats = useMemo(() => {
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => !t.completed && isOverdue(t.dueDate)).length;
    const dueSoon = tasks.filter(t => !t.completed && isDueSoon(t.dueDate)).length;
    
    return { pending, completed, overdue, dueSoon };
  }, [tasks]);

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
  };

  const handleUpdateTask = async (taskData) => {
    if (selectedTask) {
      await updateTask(selectedTask.Id, taskData);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleToggleTask = async (taskId) => {
    await toggleTask(taskId);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error title="Failed to load tasks" message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage your tasks and stay on top of your daily activities.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Due Soon</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.dueSoon}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(value) => setFilters({ ...filters, search: value })}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Priority"
              options={priorityOptions}
              value={filters.priority}
              onChange={(value) => setFilters({ ...filters, priority: value })}
            />
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={filters.completed}
              onChange={(value) => setFilters({ ...filters, completed: value })}
            />
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          message="Get started by adding your first task or adjust your filters."
          actionLabel="Add Task"
          onAction={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`${task.completed ? 'opacity-75' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => handleToggleTask(task.Id)}
                      className={`
                        mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                        ${task.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-neutral-300 hover:border-primary-500'
                        }
                      `}
                    >
                      {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-neutral-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                        <span className="flex items-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                          Due: {formatDateTime(task.dueDate)}
                        </span>
                        {task.relatedContact && (
                          <span className="flex items-center">
                            <ApperIcon name="User" className="w-4 h-4 mr-1" />
                            {task.relatedContact}
                          </span>
                        )}
                        <span className="flex items-center">
                          <ApperIcon name="UserCheck" className="w-4 h-4 mr-1" />
                          {task.assignedTo}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={task.priority}>{task.priority}</Badge>
                      {!task.completed && isOverdue(task.dueDate) && (
                        <div className="mt-1">
                          <Badge variant="high">Overdue</Badge>
                        </div>
                      )}
                      {!task.completed && isDueSoon(task.dueDate) && !isOverdue(task.dueDate) && (
                        <div className="mt-1">
                          <Badge variant="medium">Due Soon</Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsModalOpen(true);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDeleteTask(task.Id)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onSave={selectedTask ? handleUpdateTask : handleCreateTask}
      />
    </div>
  );
};

export default Tasks;