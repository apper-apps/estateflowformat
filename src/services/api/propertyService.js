import { toast } from 'react-toastify';

export const propertyService = {
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
          { field: { Name: "address" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "price" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "sqft" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "associated_contacts" } }
        ]
      };

      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      const transformedData = response.data.map(property => ({
        Id: property.Id,
        address: property.address || property.Name,
        type: property.type,
        status: property.status,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        listingDate: property.listing_date,
        associatedContacts: property.associated_contacts ? property.associated_contacts.split(',').map(c => parseInt(c.trim())) : []
      }));

      return transformedData;
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
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
          { field: { Name: "address" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } },
          { field: { Name: "price" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "sqft" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "associated_contacts" } }
        ]
      };

      const response = await apperClient.getRecordById('property', parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || 'Property not found');
      }

      const property = response.data;
      return {
        Id: property.Id,
        address: property.address,
        type: property.type,
        status: property.status,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        listingDate: property.listing_date,
        associatedContacts: property.associated_contacts ? property.associated_contacts.split(',').map(c => parseInt(c.trim())) : []
      };
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  },

  async create(propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = {
        Name: propertyData.address,
        address: propertyData.address,
        type: propertyData.type,
        status: propertyData.status,
        price: parseFloat(propertyData.price) || 0,
        bedrooms: parseInt(propertyData.bedrooms) || 0,
        bathrooms: parseInt(propertyData.bathrooms) || 0,
        sqft: parseInt(propertyData.sqft) || 0,
        listing_date: new Date().toISOString().split('T')[0],
        associated_contacts: ''
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord('property', params);
      
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
          throw new Error('Failed to create property');
        }

        const createdProperty = response.results[0].data;
        return {
          Id: createdProperty.Id,
          address: createdProperty.address,
          type: createdProperty.type,
          status: createdProperty.status,
          price: createdProperty.price,
          bedrooms: createdProperty.bedrooms,
          bathrooms: createdProperty.bathrooms,
          sqft: createdProperty.sqft,
          listingDate: createdProperty.listing_date,
          associatedContacts: []
        };
      }
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  async update(id, propertyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dbData = {
        Id: parseInt(id),
        Name: propertyData.address,
        address: propertyData.address,
        type: propertyData.type,
        status: propertyData.status,
        price: parseFloat(propertyData.price) || 0,
        bedrooms: parseInt(propertyData.bedrooms) || 0,
        bathrooms: parseInt(propertyData.bathrooms) || 0,
        sqft: parseInt(propertyData.sqft) || 0
      };

      const params = {
        records: [dbData]
      };

      const response = await apperClient.updateRecord('property', params);
      
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
          throw new Error('Failed to update property');
        }

        const updatedProperty = response.results[0].data;
        return {
          Id: updatedProperty.Id,
          address: updatedProperty.address,
          type: updatedProperty.type,
          status: updatedProperty.status,
          price: updatedProperty.price,
          bedrooms: updatedProperty.bedrooms,
          bathrooms: updatedProperty.bathrooms,
          sqft: updatedProperty.sqft,
          listingDate: updatedProperty.listing_date,
          associatedContacts: updatedProperty.associated_contacts ? updatedProperty.associated_contacts.split(',').map(c => parseInt(c.trim())) : []
        };
      }
    } catch (error) {
      console.error('Error updating property:', error);
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

      const response = await apperClient.deleteRecord('property', params);
      
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
      console.error('Error deleting property:', error);
      throw error;
    }
  }
};