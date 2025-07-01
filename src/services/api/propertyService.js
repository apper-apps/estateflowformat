import { mockProperties } from '@/services/mockData/properties.json';

let properties = [...mockProperties];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll() {
    await delay(350);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async create(propertyData) {
    await delay(450);
    const maxId = Math.max(...properties.map(p => p.Id), 0);
    const newProperty = {
      ...propertyData,
      Id: maxId + 1,
      listingDate: new Date().toISOString().split('T')[0]
    };
    properties.push(newProperty);
    return { ...newProperty };
  },

  async update(id, propertyData) {
    await delay(300);
    const index = properties.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Property not found');
    }
    properties[index] = { ...properties[index], ...propertyData };
    return { ...properties[index] };
  },

  async delete(id) {
    await delay(250);
    const index = properties.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Property not found');
    }
    properties.splice(index, 1);
    return true;
  },

  async getByStatus(status) {
    await delay(250);
    return properties.filter(p => p.status === status);
  },

  async getByType(type) {
    await delay(250);
    return properties.filter(p => p.type === type);
  }
};