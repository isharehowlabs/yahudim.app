// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV 
    ? 'http://localhost:3001' 
    : 'https://yeladim.church'
);

export default API_BASE_URL;
