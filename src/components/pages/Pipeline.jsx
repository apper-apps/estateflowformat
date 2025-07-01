import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { useContacts } from '@/hooks/useContacts';
import { formatDate } from '@/utils/dateHelpers';

const ContactCard = ({ contact, onEdit, onStageChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', contact.Id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`
        bg-white rounded-lg p-4 border border-neutral-200 cursor-move shadow-sm hover:shadow-md transition-all
        ${isDragging ? 'opacity-50 rotate-2' : ''}
      `}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
          <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon="MoreVertical"
          onClick={() => onEdit(contact)}
        />
      </div>
      
      <h4 className="font-semibold text-neutral-900 mb-1">{contact.name}</h4>
      <p className="text-sm text-neutral-600 mb-2">{contact.email}</p>
      
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{formatDate(contact.lastContact)}</span>
        <Badge variant={contact.type}>{contact.type}</Badge>
      </div>
      
      {contact.tags && contact.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {contact.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const PipelineColumn = ({ stage, contacts, onContactStageChange, onEdit }) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const stageConfig = {
    new: {
      title: 'New Leads',
      color: 'bg-blue-50 border-blue-200',
      headerColor: 'text-blue-700',
      icon: 'UserPlus'
    },
    contacted: {
      title: 'Contacted',
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'text-yellow-700',
      icon: 'Phone'
    },
    showing: {
      title: 'Property Showing',
      color: 'bg-purple-50 border-purple-200',
      headerColor: 'text-purple-700',
      icon: 'Home'
    },
    negotiating: {
      title: 'Negotiating',
      color: 'bg-orange-50 border-orange-200',
      headerColor: 'text-orange-700',
      icon: 'Handshake'
    },
    closed: {
      title: 'Closed',
      color: 'bg-green-50 border-green-200',
      headerColor: 'text-green-700',
      icon: 'CheckCircle'
    }
  };

  const config = stageConfig[stage];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggedOver(false);
    
    const contactId = e.dataTransfer.getData('text/plain');
    if (contactId) {
      onContactStageChange(parseInt(contactId), stage);
    }
  };

  return (
    <div className="flex-1 min-w-72">
      <div className={`${config.color} rounded-lg border-2 h-full ${isDraggedOver ? 'border-primary-400 bg-primary-50' : ''}`}>
        {/* Column Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name={config.icon} className={`w-5 h-5 ${config.headerColor}`} />
              <h3 className={`font-semibold ${config.headerColor}`}>
                {config.title}
              </h3>
            </div>
            <Badge variant="default">{contacts.length}</Badge>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className="p-4 min-h-96 space-y-3"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ApperIcon name={config.icon} className="w-12 h-12 text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500">No contacts in this stage</p>
            </div>
          ) : (
            contacts.map(contact => (
              <ContactCard
                key={contact.Id}
                contact={contact}
                onEdit={onEdit}
                onStageChange={onContactStageChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Pipeline = () => {
  const { contacts, loading, error, updateContactStage } = useContacts();
  
  const contactsByStage = useMemo(() => {
    const stages = {
      new: [],
      contacted: [],
      showing: [],
      negotiating: [],
      closed: []
    };
    
    contacts.forEach(contact => {
      if (stages[contact.stage]) {
        stages[contact.stage].push(contact);
      }
    });
    
    return stages;
  }, [contacts]);

  const pipelineStats = useMemo(() => {
    const total = contacts.length;
    const conversionRate = total > 0 ? Math.round((contactsByStage.closed.length / total) * 100) : 0;
    const activeLeads = total - contactsByStage.closed.length;
    
    return {
      totalContacts: total,
      activeLeads,
      closedDeals: contactsByStage.closed.length,
      conversionRate
    };
  }, [contacts, contactsByStage]);

  const handleContactStageChange = async (contactId, newStage) => {
    try {
      await updateContactStage(contactId, newStage);
    } catch (error) {
      console.error('Failed to update contact stage:', error);
    }
  };

  const handleEditContact = (contact) => {
    // This would open the contact edit modal
    console.log('Edit contact:', contact);
  };

  if (loading) return <Loading type="default" />;
  if (error) return <Error title="Failed to load pipeline" message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Sales Pipeline
          </h1>
          <p className="mt-2 text-neutral-600">
            Track leads through your sales process with drag-and-drop functionality.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button variant="secondary" icon="Download">
            Export Pipeline
          </Button>
          <Button variant="primary" icon="Plus">
            Add Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Contacts</p>
              <p className="text-2xl font-bold text-primary-600">{pipelineStats.totalContacts}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <ApperIcon name="Users" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Active Leads</p>
              <p className="text-2xl font-bold text-yellow-600">{pipelineStats.activeLeads}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Closed Deals</p>
              <p className="text-2xl font-bold text-green-600">{pipelineStats.closedDeals}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{pipelineStats.conversionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <ApperIcon name="Target" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline Board */}
      {contacts.length === 0 ? (
        <Empty
          icon="GitBranch"
          title="No contacts in pipeline"
          message="Start building your sales pipeline by adding contacts and leads."
          actionLabel="Add First Contact"
        />
      ) : (
        <Card className="overflow-x-auto">
          <div className="flex space-x-4 pb-4" style={{ minWidth: '1200px' }}>
            {Object.entries(contactsByStage).map(([stage, stageContacts]) => (
              <PipelineColumn
                key={stage}
                stage={stage}
                contacts={stageContacts}
                onContactStageChange={handleContactStageChange}
                onEdit={handleEditContact}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Pipeline Tips */}
      <Card>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <ApperIcon name="Lightbulb" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Pipeline Tips</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Drag and drop contacts between stages to update their status</li>
              <li>• Follow up with contacts in the "Contacted" stage within 24 hours</li>
              <li>• Schedule property showings for leads in the "Showing" stage</li>
              <li>• Keep detailed notes on each contact for better relationship management</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Pipeline;