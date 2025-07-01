import { toast } from 'react-toastify';

export const eventService = {
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
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "type" } },
          { field: { Name: "location" } },
          { field: { Name: "attendees" } },
          { field: { Name: "related_contact" } },
          { field: { Name: "google_event_id" } }
        ]
      };

      const response = await apperClient.fetchRecords('event', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      const transformedData = response.data.map(event => ({
        Id: event.Id,
        title: event.title || event.Name,
        start: event.start,
        end: event.end,
        type: event.type,
        location: event.location,
        attendees: event.attendees ? event.attendees.split(',').map(a => a.trim()) : [],
        relatedContact: event.related_contact,
        googleEventId: event.google_event_id
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
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
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "type" } },
          { field: { Name: "location" } },
          { field: { Name: "attendees" } },
          { field: { Name: "related_contact" } },
          { field: { Name: "google_event_id" } }
        ]
      };

      const response = await apperClient.getRecordById('event', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || 'Event not found');
      }

      const event = response.data;
      return {
        Id: event.Id,
        title: event.title,
        start: event.start,
        end: event.end,
        type: event.type,
        location: event.location,
        attendees: event.attendees ? event.attendees.split(',').map(a => a.trim()) : [],
        relatedContact: event.related_contact,
        googleEventId: event.google_event_id
      };
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  async create(eventData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = {
        Name: eventData.title,
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        type: eventData.type,
        location: eventData.location || '',
        attendees: Array.isArray(eventData.attendees) ? eventData.attendees.join(', ') : eventData.attendees || '',
        related_contact: eventData.relatedContact || '',
        google_event_id: `apper_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('event', params);
      
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
          throw new Error('Failed to create event');
        }

        const createdEvent = response.results[0].data;
        return {
          Id: createdEvent.Id,
          title: createdEvent.title,
          start: createdEvent.start,
          end: createdEvent.end,
          type: createdEvent.type,
          location: createdEvent.location,
          attendees: createdEvent.attendees ? createdEvent.attendees.split(',').map(a => a.trim()) : [],
          relatedContact: createdEvent.related_contact,
          googleEventId: createdEvent.google_event_id
        };
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async update(id, eventData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = {
        Id: parseInt(id),
        Name: eventData.title,
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        type: eventData.type,
        location: eventData.location || '',
        attendees: Array.isArray(eventData.attendees) ? eventData.attendees.join(', ') : eventData.attendees || '',
        related_contact: eventData.relatedContact || ''
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('event', params);
      
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
          throw new Error('Failed to update event');
        }

        const updatedEvent = response.results[0].data;
        return {
          Id: updatedEvent.Id,
          title: updatedEvent.title,
          start: updatedEvent.start,
          end: updatedEvent.end,
          type: updatedEvent.type,
          location: updatedEvent.location,
          attendees: updatedEvent.attendees ? updatedEvent.attendees.split(',').map(a => a.trim()) : [],
          relatedContact: updatedEvent.related_contact,
          googleEventId: updatedEvent.google_event_id
        };
      }
    } catch (error) {
      console.error('Error updating event:', error);
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

      const response = await apperClient.deleteRecord('event', params);
      
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
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};