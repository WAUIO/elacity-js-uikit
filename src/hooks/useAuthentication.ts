import { useContext } from 'react';
import Context from '../contexts/AuthenticationContext';

const useAuthentication = () => useContext(Context);
export default useAuthentication;
