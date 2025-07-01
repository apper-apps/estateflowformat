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
import { useContacts } from '@/hooks/useContacts';
import { filterContacts, sortData } from '@/utils/filterHelpers';
import { formatDate } from '@/utils/dateHelpers';

const ContactModal = ({ isOpen, onClose, contact, onSave }) => {
const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    type: contact?.type || 'lead',
    stage: contact?.stage || 'new',
    assignedTo: contact?.assignedTo || 'John Smith',
    tags: contact?.tags?.join(', ') || '',
    notes: contact?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const contactData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    onSave(contactData);
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
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          <Button variant="ghost" size="sm" icon="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="input"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="showing">Showing</option>
                <option value="negotiating">Negotiating</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <Input
              label="Assigned To"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="first-time-buyer, residential, urgent"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input min-h-24"
              placeholder="Add any additional notes about this contact..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {contact ? 'Update Contact' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Contacts = () => {
  const { contacts, loading, error, createContact, updateContact, deleteContact } = useContacts();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    search: '',
    stage: '',
    type: '',
    assignedTo: ''
  });

  const stageOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'showing', label: 'Showing' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'closed', label: 'Closed' }
  ];

  const typeOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'client', label: 'Client' }
  ];

  const filteredContacts = useMemo(() => {
    const filtered = filterContacts(contacts, filters);
    return sortData(filtered, 'name');
  }, [contacts, filters]);

  const handleCreateContact = async (contactData) => {
    await createContact(contactData);
  };

  const handleUpdateContact = async (contactData) => {
    if (selectedContact) {
      await updateContact(selectedContact.Id, contactData);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(contactId);
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error title="Failed to load contacts" message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Contacts
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage your leads, prospects, and clients in one place.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button
            variant="secondary"
            icon={viewMode === 'list' ? 'Grid' : 'List'}
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          />
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => {
              setSelectedContact(null);
              setIsModalOpen(true);
            }}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search contacts..."
              value={filters.search}
              onChange={(value) => setFilters({ ...filters, search: value })}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Stage"
              options={stageOptions}
              value={filters.stage}
              onChange={(value) => setFilters({ ...filters, stage: value })}
            />
            <FilterDropdown
              label="Type"
              options={typeOptions}
              value={filters.type}
              onChange={(value) => setFilters({ ...filters, type: value })}
            />
          </div>
        </div>
      </Card>

      {/* Contacts List/Grid */}
      {filteredContacts.length === 0 ? (
        <Empty
          icon="Users"
          title="No contacts found"
          message="Get started by adding your first contact or adjust your filters."
          actionLabel="Add Contact"
          onAction={() => {
            setSelectedContact(null);
            setIsModalOpen(true);
          }}
        />
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card interactive onClick={() => setSelectedContact(contact)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {contact.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span className="flex items-center">
                          <ApperIcon name="Mail" className="w-4 h-4 mr-1" />
                          {contact.email}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Phone" className="w-4 h-4 mr-1" />
                          {contact.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={contact.stage}>{contact.stage}</Badge>
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatDate(contact.lastContact)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(contact);
                          setIsModalOpen(true);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContact(contact.Id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card interactive onClick={() => setSelectedContact(contact)}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="User" className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {contact.name}
                  </h3>
                  <div className="space-y-2 text-sm text-neutral-600 mb-4">
                    <p className="flex items-center justify-center">
                      <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                      {contact.email}
                    </p>
                    <p className="flex items-center justify-center">
                      <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                      {contact.phone}
                    </p>
                  </div>
                  <div className="flex justify-center mb-4">
                    <Badge variant={contact.stage}>{contact.stage}</Badge>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedContact(contact);
                        setIsModalOpen(true);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContact(contact.Id);
                      }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSave={selectedContact ? handleUpdateContact : handleCreateContact}
      />
    </div>
  );
};

export default Contacts;