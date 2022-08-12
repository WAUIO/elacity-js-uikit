/* eslint-disable no-case-declarations */
import React from 'react';
import { IStorage } from '@elacity-js/lib'
import { IUserPreferences } from '../types';

export interface AppSettingsContextValue {
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
  storage: IStorage<IUserPreferences>
}

const AppSettingsContext = React.createContext<AppSettingsContextValue>({
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

export const AppSettingsProvider: React.FC<React.PropsWithChildren<AppSettingsProviderProps>> = ({
  children,
  storage,
}: React.PropsWithChildren<AppSettingsProviderProps>) => {
  const [values, dispatch] = React.useReducer(
    reducerFactory(storage),
    storage.toJSON()
  );

  const load = () => dispatch({
    type: 'LOAD',
  });

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