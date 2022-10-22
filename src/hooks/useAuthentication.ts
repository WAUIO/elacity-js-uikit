import { buildContextHook } from './utils';
import Context from '../contexts/AuthenticationContext';

const useAuthentication = buildContextHook(Context, 'useAuthentication', 'AuthenticationProvider');
export default useAuthentication;
