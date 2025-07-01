import { toast } from 'react-toastify';

export const contactService = {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "type" } },
          { field: { Name: "stage" } },
          { field: { Name: "assigned_to" } },
          { field: { Name: "Tags" } },
          { field: { Name: "notes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_contact" } }
        ]
      };

      const response = await apperClient.fetchRecords('app_contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      const transformedData = response.data.map(contact => ({
        Id: contact.Id,
        name: contact.Name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        stage: contact.stage,
        assignedTo: contact.assigned_to,
        tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()) : [],
        notes: contact.notes,
        createdAt: contact.created_at,
        lastContact: contact.last_contact
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "type" } },
          { field: { Name: "stage" } },
          { field: { Name: "assigned_to" } },
          { field: { Name: "Tags" } },
          { field: { Name: "notes" } },
          { field: { Name: "created_at" } },
          { field: { Name: "last_contact" } }
        ]
      };

      const response = await apperClient.getRecordById('app_contact', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || 'Contact not found');
      }

      // Transform database fields to UI format
      const contact = response.data;
      return {
        Id: contact.Id,
        name: contact.Name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        stage: contact.stage,
        assignedTo: contact.assigned_to,
        tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()) : [],
        notes: contact.notes,
        createdAt: contact.created_at,
        lastContact: contact.last_contact
      };
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format - only updateable fields
      const dbData = {
        Name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || '',
        type: contactData.type,
        stage: contactData.stage,
        assigned_to: contactData.assignedTo,
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(', ') : contactData.tags || '',
        notes: contactData.notes || '',
        created_at: new Date().toISOString(),
        last_contact: new Date().toISOString()
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('app_contact', params);
      
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
          throw new Error('Failed to create contact');
        }

        const createdContact = response.results[0].data;
        return {
          Id: createdContact.Id,
          name: createdContact.Name,
          email: createdContact.email,
          phone: createdContact.phone,
          type: createdContact.type,
          stage: createdContact.stage,
          assignedTo: createdContact.assigned_to,
          tags: createdContact.Tags ? createdContact.Tags.split(',').map(tag => tag.trim()) : [],
          notes: createdContact.notes,
          createdAt: createdContact.created_at,
          lastContact: createdContact.last_contact
        };
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI data to database format - only updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || '',
        type: contactData.type,
        stage: contactData.stage,
        assigned_to: contactData.assignedTo,
        Tags: Array.isArray(contactData.tags) ? contactData.tags.join(', ') : contactData.tags || '',
        notes: contactData.notes || '',
        last_contact: new Date().toISOString()
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('app_contact', params);
      
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
          throw new Error('Failed to update contact');
        }

        const updatedContact = response.results[0].data;
        return {
          Id: updatedContact.Id,
          name: updatedContact.Name,
          email: updatedContact.email,
          phone: updatedContact.phone,
          type: updatedContact.type,
          stage: updatedContact.stage,
          assignedTo: updatedContact.assigned_to,
          tags: updatedContact.Tags ? updatedContact.Tags.split(',').map(tag => tag.trim()) : [],
          notes: updatedContact.notes,
          createdAt: updatedContact.created_at,
          lastContact: updatedContact.last_contact
        };
      }
    } catch (error) {
      console.error('Error updating contact:', error);
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

      const response = await apperClient.deleteRecord('app_contact', params);
      
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
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  async updateStage(id, newStage) {
    return await this.update(id, { stage: newStage });
  }
};