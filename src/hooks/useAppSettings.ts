import { buildContextHook } from './utils';
import Context from '../contexts/AppSettingsContext';

const useAppSettings = buildContextHook(Context, 'useAppSettings', 'AppSettingsProvider');
export default useAppSettings;
