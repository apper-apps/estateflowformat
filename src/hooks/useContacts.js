import { useState, useEffect } from 'react';
import { contactService } from '@/services/api/contactService';
import { toast } from 'react-toastify';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [...prev, newContact]);
      toast.success('Contact created successfully');
      return newContact;
    } catch (err) {
      toast.error('Failed to create contact');
      throw err;
    }
  };

  const updateContact = async (id, contactData) => {
    try {
      const updatedContact = await contactService.update(id, contactData);
      setContacts(prev => prev.map(c => c.Id === parseInt(id) ? updatedContact : c));
      toast.success('Contact updated successfully');
      return updatedContact;
    } catch (err) {
      toast.error('Failed to update contact');
      throw err;
    }
  };

  const deleteContact = async (id) => {
    try {
      await contactService.delete(id);
      setContacts(prev => prev.filter(c => c.Id !== parseInt(id)));
      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contact');
      throw err;
    }
  };

  const updateContactStage = async (id, newStage) => {
    try {
      const updatedContact = await contactService.updateStage(id, newStage);
      setContacts(prev => prev.map(c => c.Id === parseInt(id) ? updatedContact : c));
      toast.success('Contact stage updated');
      return updatedContact;
    } catch (err) {
      toast.error('Failed to update contact stage');
      throw err;
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    loadContacts,
    createContact,
    updateContact,
    deleteContact,
    updateContactStage
  };
};