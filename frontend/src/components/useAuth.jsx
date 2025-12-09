import { useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';

// Custom hook to easily consume auth context
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;