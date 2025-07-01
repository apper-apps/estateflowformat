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
import { useProperties } from '@/hooks/useProperties';
import { filterProperties, sortData } from '@/utils/filterHelpers';
import { formatCurrency, formatNumber } from '@/utils/dateHelpers';

const PropertyModal = ({ isOpen, onClose, property, onSave }) => {
  const [formData, setFormData] = useState({
    address: property?.address || '',
    type: property?.type || 'residential',
    status: property?.status || 'available',
    price: property?.price || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    sqft: property?.sqft || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const propertyData = {
      ...formData,
      price: parseInt(formData.price) || 0,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      sqft: parseInt(formData.sqft) || 0
    };
    onSave(propertyData);
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
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <Button variant="ghost" size="sm" icon="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Main Street, City, State ZIP"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="450000"
            />
            <Input
              label="Square Feet"
              type="number"
              value={formData.sqft}
              onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
              placeholder="2500"
            />
          </div>

          {formData.type === 'residential' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="3"
              />
              <Input
                label="Bathrooms"
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="2.5"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {property ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Properties = () => {
  const { properties, loading, error, createProperty, updateProperty, deleteProperty } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: ''
  });

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' }
  ];

  const typeOptions = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' }
  ];

  const filteredProperties = useMemo(() => {
    const filtered = filterProperties(properties, filters);
    return sortData(filtered, 'price', 'desc');
  }, [properties, filters]);

  const handleCreateProperty = async (propertyData) => {
    await createProperty(propertyData);
  };

  const handleUpdateProperty = async (propertyData) => {
    if (selectedProperty) {
      await updateProperty(selectedProperty.Id, propertyData);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(propertyId);
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error title="Failed to load properties" message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Properties
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage your property listings and track their status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button
            variant="secondary"
            icon={viewMode === 'grid' ? 'List' : 'Grid'}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          />
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => {
              setSelectedProperty(null);
              setIsModalOpen(true);
            }}
          >
            Add Property
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search properties..."
              value={filters.search}
              onChange={(value) => setFilters({ ...filters, search: value })}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
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

      {/* Properties List/Grid */}
      {filteredProperties.length === 0 ? (
        <Empty
          icon="Building2"
          title="No properties found"
          message="Get started by adding your first property or adjust your filters."
          actionLabel="Add Property"
          onAction={() => {
            setSelectedProperty(null);
            setIsModalOpen(true);
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <motion.div
              key={property.Id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card interactive onClick={() => setSelectedProperty(property)}>
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Building2" className="w-12 h-12 text-neutral-400" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={property.status}>{property.status}</Badge>
                      <p className="text-xl font-bold text-primary-600">
                        {formatCurrency(property.price)}
                      </p>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {property.address}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                      <span className="capitalize">{property.type}</span>
                      {property.sqft > 0 && (
                        <span>{formatNumber(property.sqft)} sq ft</span>
                      )}
                    </div>
                    
                    {property.type === 'residential' && property.bedrooms > 0 && (
                      <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
                        <span className="flex items-center">
                          <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                          {property.bedrooms} bed
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                          {property.bathrooms} bath
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(property);
                          setIsModalOpen(true);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProperty(property.Id);
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
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <motion.div
              key={property.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card interactive onClick={() => setSelectedProperty(property)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building2" className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {property.address}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span className="capitalize">{property.type}</span>
                        {property.sqft > 0 && (
                          <span>{formatNumber(property.sqft)} sq ft</span>
                        )}
                        {property.type === 'residential' && property.bedrooms > 0 && (
                          <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-600">
                        {formatCurrency(property.price)}
                      </p>
                      <Badge variant={property.status}>{property.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(property);
                          setIsModalOpen(true);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProperty(property.Id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Property Modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
        onSave={selectedProperty ? handleUpdateProperty : handleCreateProperty}
      />
    </div>
  );
};

export default Properties;