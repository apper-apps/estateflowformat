import { useState, useEffect } from 'react';
import { eventService } from '@/services/api/eventService';
import { toast } from 'react-toastify';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to load events');
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const newEvent = await eventService.create(eventData);
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (err) {
      toast.error('Failed to create event');
      throw err;
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const updatedEvent = await eventService.update(id, eventData);
      setEvents(prev => prev.map(e => e.Id === parseInt(id) ? updatedEvent : e));
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (err) {
      toast.error('Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.delete(id);
      setEvents(prev => prev.filter(e => e.Id !== parseInt(id)));
      toast.success('Event deleted successfully');
    } catch (err) {
      toast.error('Failed to delete event');
      throw err;
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};