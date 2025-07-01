import { mockTasks } from '@/services/mockData/tasks.json';

let tasks = [...mockTasks];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(250);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...tasks.map(t => t.Id), 0);
    const newTask = {
      ...taskData,
      Id: maxId + 1,
      completed: false
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks[index] = { ...tasks[index], ...taskData };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(index, 1);
    return true;
  },

  async toggleComplete(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    task.completed = !task.completed;
    return { ...task };
  },

  async getByPriority(priority) {
    await delay(250);
    return tasks.filter(t => t.priority === priority);
  },

  async getDueSoon() {
    await delay(250);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate <= tomorrow && !t.completed;
    });
  }
};