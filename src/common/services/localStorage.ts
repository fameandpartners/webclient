const getLocalData = (key: string) => {
  if (typeof localStorage !== 'undefined') {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  }
  return null;
};

const setLocalData = (key: string, value: any) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export { getLocalData, setLocalData };
