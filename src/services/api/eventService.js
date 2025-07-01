import { mockEvents } from '@/services/mockData/events.json';

let events = [...mockEvents];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const eventService = {
  async getAll() {
    await delay(300);
    return [...events];
  },

  async getById(id) {
    await delay(200);
    const event = events.find(e => e.Id === parseInt(id));
    if (!event) {
      throw new Error('Event not found');
    }
    return { ...event };
  },

  async create(eventData) {
    await delay(400);
    const maxId = Math.max(...events.map(e => e.Id), 0);
    const newEvent = {
      ...eventData,
      Id: maxId + 1,
      googleEventId: `gmail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    events.push(newEvent);
    return { ...newEvent };
  },

  async update(id, eventData) {
    await delay(300);
    const index = events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Event not found');
    }
    events[index] = { ...events[index], ...eventData };
    return { ...events[index] };
  },

  async delete(id) {
    await delay(250);
    const index = events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Event not found');
    }
    events.splice(index, 1);
    return true;
  },

  async getByDateRange(startDate, endDate) {
    await delay(250);
    return events.filter(e => {
      const eventDate = new Date(e.start);
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    });
  },

  async getByType(type) {
    await delay(250);
    return events.filter(e => e.type === type);
  },

  async getTodaysEvents() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.start.includes(today));
  }
};