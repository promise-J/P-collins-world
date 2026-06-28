
export const parseFormData = (body: any): any => {
    const result: any = {};
  
    for (const [key, value] of Object.entries(body)) {
      // Handle nested fields (e.g., location.address)
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        if (!result[parent]) result[parent] = {};
        result[parent][child] = value;
      } 
      // Handle array fields (e.g., media[0].url)
      else if (key.includes('[') && key.includes(']')) {
        const match = key.match(/(\w+)\[(\d+)\]\.(\w+)/);
        if (match) {
          const [, field, index, subField] = match;
          if (!result[field]) result[field] = [];
          if (!result[field][parseInt(index)]) result[field][parseInt(index)] = {};
          result[field][parseInt(index)][subField] = value;
        }
      }
      // Handle numeric fields
      else if (['price', 'stock', 'bedrooms', 'bathrooms', 'toilets', 'order'].includes(key)) {
        result[key] = parseFloat(value as string) || 0;
      }
      // Handle boolean fields
      else if (['furnished', 'isFeatured', 'isActive', 'penaltiesEnabled'].includes(key)) {
        result[key] = value === 'true' || value === 'on' || value === '1';
      }
      // Regular fields
      else {
        result[key] = value;
      }
    }
  
    return result;
  };