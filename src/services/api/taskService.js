import { toast } from 'react-toastify';

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "reminder" } },
          { field: { Name: "priority" } },
          { field: { Name: "assigned_to" } },
          { field: { Name: "related_contact" } },
          { field: { Name: "completed" } }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      const transformedData = response.data.map(task => ({
        Id: task.Id,
        title: task.title || task.Name,
        description: task.description,
        dueDate: task.due_date,
        reminder: task.reminder,
        priority: task.priority,
        assignedTo: task.assigned_to,
        relatedContact: task.related_contact,
        completed: task.completed
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "due_date" } },
          { field: { Name: "reminder" } },
          { field: { Name: "priority" } },
          { field: { Name: "assigned_to" } },
          { field: { Name: "related_contact" } },
          { field: { Name: "completed" } }
        ]
      };

      const response = await apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || 'Task not found');
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title || task.Name,
        description: task.description,
        dueDate: task.due_date,
        reminder: task.reminder,
        priority: task.priority,
        assignedTo: task.assigned_to,
        relatedContact: task.related_contact,
        completed: task.completed
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format
      const dbData = {
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description || '',
        due_date: taskData.dueDate,
        reminder: taskData.reminder || null,
        priority: taskData.priority,
        assigned_to: taskData.assignedTo,
        related_contact: taskData.relatedContact || '',
        completed: false
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create task');
        }

        const createdTask = response.results[0].data;
        return {
          Id: createdTask.Id,
          title: createdTask.title,
          description: createdTask.description,
          dueDate: createdTask.due_date,
          reminder: createdTask.reminder,
          priority: createdTask.priority,
          assignedTo: createdTask.assigned_to,
          relatedContact: createdTask.related_contact,
          completed: createdTask.completed
        };
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = {
        Id: parseInt(id),
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description || '',
        due_date: taskData.dueDate,
        reminder: taskData.reminder || null,
        priority: taskData.priority,
        assigned_to: taskData.assignedTo,
        related_contact: taskData.relatedContact || '',
        completed: taskData.completed !== undefined ? taskData.completed : false
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update task');
        }

        const updatedTask = response.results[0].data;
        return {
          Id: updatedTask.Id,
          title: updatedTask.title,
          description: updatedTask.description,
          dueDate: updatedTask.due_date,
          reminder: updatedTask.reminder,
          priority: updatedTask.priority,
          assignedTo: updatedTask.assigned_to,
          relatedContact: updatedTask.related_contact,
          completed: updatedTask.completed
        };
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return true;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      // Get current task to toggle its status
      const currentTask = await this.getById(id);
      return await this.update(id, { 
        ...currentTask, 
        completed: !currentTask.completed 
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }
};