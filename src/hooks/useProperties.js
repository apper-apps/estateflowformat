import { useState, useEffect } from 'react';
import { propertyService } from '@/services/api/propertyService';
import { toast } from 'react-toastify';

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData) => {
    try {
      const newProperty = await propertyService.create(propertyData);
      setProperties(prev => [...prev, newProperty]);
      toast.success('Property created successfully');
      return newProperty;
    } catch (err) {
      toast.error('Failed to create property');
      throw err;
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      const updatedProperty = await propertyService.update(id, propertyData);
      setProperties(prev => prev.map(p => p.Id === parseInt(id) ? updatedProperty : p));
      toast.success('Property updated successfully');
      return updatedProperty;
    } catch (err) {
      toast.error('Failed to update property');
      throw err;
    }
  };

  const deleteProperty = async (id) => {
    try {
      await propertyService.delete(id);
      setProperties(prev => prev.filter(p => p.Id !== parseInt(id)));
      toast.success('Property deleted successfully');
    } catch (err) {
      toast.error('Failed to delete property');
      throw err;
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    loadProperties,
    createProperty,
    updateProperty,
    deleteProperty
  };
};