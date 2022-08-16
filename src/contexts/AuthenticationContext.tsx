import React from 'react';
import { IAuth, IUser } from '@elacity-js/lib';

export interface AuthenticationContextValue<T, P extends IUser.ProfileBase<T>> extends IAuth.IConnector<T, P> { }

// @todo: review type maked as unknown for now
const AuthenticationContext = React.createContext<AuthenticationContextValue<any, IUser.ProfileBase<any>>>({
  isAuthenticated: false,
  connect: () => Promise.reject(new Error('[AuthenticationContext.connect] not implemented')),
  disconnect: () => Promise.reject(new Error('[AuthenticationContext.disconnect] not implemented')),
});

export default AuthenticationContext;

export interface AuthenticationProviderProps<T, P extends IUser.ProfileBase<T>> {
  connector: IAuth.IConnector<T, P>;
}

export const AuthenticationProvider = <T, P extends IUser.ProfileBase<T>>({ connector, children }: React.PropsWithChildren<AuthenticationProviderProps<T, P>>) => (
  <AuthenticationContext.Provider value={connector}>
    {children}
  </AuthenticationContext.Provider>
);
