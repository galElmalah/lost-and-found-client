import * as React from 'react';
import { useLocalStorage } from '../../customHooks/useLocalStorage';
import { useApi } from '../../customHooks/useApi';

export const UserDetailsContext = React.createContext({
  userDetails: {},
  setUserDetails: () => {
    throw new Error('ho shit renderd outside of a provider');
  },
});

export const UserDetailsProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useLocalStorage('LAF-user-details', {});
  const { data } = useApi('/labels', { initialData: {} });

  return (
    <UserDetailsContext.Provider
      value={{ userDetails, setUserDetails, labels: data }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};
