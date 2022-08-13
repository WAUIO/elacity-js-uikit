/* eslint-disable no-case-declarations */
import React from 'react';
import { IStorage } from '@elacity-js/lib'
import { IUserPreferences } from '../types';

interface LogoSet {
  primary: string;
  alt?: string;
  minimized?: string;
}

export interface AppSettingsContextValue {
  appName: string;
  logo: LogoSet;
  values: IUserPreferences;
  setValues: (v: Partial<IUserPreferences>) => void;
  load: () => void;
}

export const defaultValues: IUserPreferences = {
  theme: 'light',
  lang: (navigator.language || 'en').substr(0, 2),
  searchbar: false,
  sidebarMinimized: true,
};

interface AppSettingsProviderProps {
  appName: string;
  logo: LogoSet;
  storage: IStorage<IUserPreferences>
}

const AppSettingsContext = React.createContext<AppSettingsContextValue>({
  appName: '',
  logo: { primary: '' },
  values: defaultValues,
  setValues: () => { },
  load: () => { },
});

type LoadAction = {
  type: 'LOAD';
};

type SetAction = {
  type: 'SET';
  payload: Partial<IUserPreferences>;
};

type Action = LoadAction | SetAction;

declare type ReducerFactory = (storage: IStorage<IUserPreferences>) => (state: IUserPreferences, action: Action) => IUserPreferences;

const reducerFactory: ReducerFactory = (storage: IStorage<IUserPreferences>) => (state: IUserPreferences, action: Action): IUserPreferences => {
  switch (action.type) {
    case 'LOAD':
      return storage.toJSON();

    case 'SET':
      return storage.set(action.payload).toJSON();
    default:
      return state;
  }
};

export const AppSettingsProvider = ({
  appName,
  logo: _logo,
  storage,
  children,
}: React.PropsWithChildren<AppSettingsProviderProps>) => {
  const [values, dispatch] = React.useReducer(
    reducerFactory(storage),
    storage.toJSON()
  );

  const load = () => dispatch({
    type: 'LOAD',
  });

  const logo = Object.entries(_logo).reduce(
    (l, [key, value]) => ({
      ...l,
      [key]: value?.replace('[theme]', values.theme)
    }), {}
  ) as LogoSet;

  const setValues = (payload: Partial<IUserPreferences>) => dispatch({
    type: 'SET',
    payload,
  });

  React.useEffect(() => {
    load();
    setValues(values);
  }, []);

  return (
    <AppSettingsContext.Provider
      value={{
        appName,
        logo,
        values,
        setValues,
        load,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export default AppSettingsContext;