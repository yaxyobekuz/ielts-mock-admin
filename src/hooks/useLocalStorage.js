const useLocalStorage = (storageKey) => {
  // Get data from localStorage by key
  const getData = () => {
    return JSON.parse(localStorage.getItem(storageKey));
  };

  // Save data to localStorage
  const setData = (dataToSave) => {
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  };

  // Update single property in stored object
  const updateProperty = (propertyKey, newPropertyValue) => {
    const currentData = getData();
    currentData[propertyKey] = newPropertyValue;

    localStorage.setItem(storageKey, JSON.stringify(currentData));
  };

  // Get single property
  const getProperty = (property) => {
    const data = getData();
    return data[property];
  };

  // Remove data from localStorage
  const removeData = () => {
    localStorage.removeItem(storageKey);
  };

  // Initialize with empty object if no data exists
  const existingValue = getData();
  if (!existingValue) setData({});

  return {
    setData,
    getData,
    removeData,
    getProperty,
    updateProperty,
  };
};

export default useLocalStorage;
