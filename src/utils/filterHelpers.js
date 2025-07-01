export const filterContacts = (contacts, filters) => {
  return contacts.filter(contact => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm) ||
        (contact.notes && contact.notes.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Stage filter
    if (filters.stage && filters.stage !== contact.stage) {
      return false;
    }

    // Type filter
    if (filters.type && filters.type !== contact.type) {
      return false;
    }

    // Assigned to filter
    if (filters.assignedTo && filters.assignedTo !== contact.assignedTo) {
      return false;
    }

    return true;
  });
};

export const filterProperties = (properties, filters) => {
  return properties.filter(property => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = property.address.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== property.status) {
      return false;
    }

    // Type filter
    if (filters.type && filters.type !== property.type) {
      return false;
    }

    // Price range filter
    if (filters.minPrice && property.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice && property.price > filters.maxPrice) {
      return false;
    }

    return true;
  });
};

export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm)) ||
        (task.relatedContact && task.relatedContact.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority !== task.priority) {
      return false;
    }

    // Completion filter
    if (filters.completed !== undefined && filters.completed !== task.completed) {
      return false;
    }

    // Assigned to filter
    if (filters.assignedTo && filters.assignedTo !== task.assignedTo) {
      return false;
    }

    return true;
  });
};

export const sortData = (data, sortField, sortDirection = 'asc') => {
  return [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export const getUniqueValues = (data, field) => {
  const values = data.map(item => item[field]).filter(Boolean);
  return [...new Set(values)].sort();
};