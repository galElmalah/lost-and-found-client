import React, { useState, useContext, createContext, useEffect } from 'react';
import * as style from './Drawer.module.scss';
import MDrawer from '@material-ui/core/Drawer';
import { FilterList } from './FilterList';
import { UserMatchesList } from './UserMatchesList';
import { UserSettingsPanel } from './UserSettings';

export const drawers = {
  FILTER: 'FILTER',
  MATCH: 'MATCH',
  MESSAGES: 'MESSAGES',
  SETTINGS: 'SETTINGS',
};

export const DrawerContext = createContext({});

export const DrawerProvider = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState('');
  const [badgeCount, setBadgeCounts] = useState({});
  const [filterState, setFilterState] = useState({});
  const incBadgeCount = (bId) => {
    setBadgeCounts((p) => {
      if (p[bId]) {
        return { ...p, [bId]: p[bId] + 1 };
      }
      return { ...p, [bId]: 1 };
    });
  };

  const decBadgeCount = (bId) => {
    setBadgeCounts((p) => {
      if (p[bId] && p[bId] > 0) {
        return { ...p, [bId]: p[bId] - 1 };
      }
      return { ...p, [bId]: 0 };
    });
  };

  return (
    <DrawerContext.Provider
      value={{
        openDrawer,
        setOpenDrawer,
        incBadgeCount,
        decBadgeCount,
        badgeCount,
        filterState,
        setFilterState,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const Drawer = ({ showAlert }) => {
  const { openDrawer, setOpenDrawer } = useContext(DrawerContext);
  const drawersMapping = {
    [drawers.FILTER]: () => <FilterList showAlert={showAlert} />,
    [drawers.MATCH]: () => <UserMatchesList showAlert={showAlert} />,
    [drawers.SETTINGS]: () => <UserSettingsPanel showAlert={showAlert} />,
  };
  return (
    <MDrawer
      anchor={'left'}
      open={!!openDrawer}
      onClose={() => setOpenDrawer('')}
    >
      {drawersMapping[openDrawer] ? drawersMapping[openDrawer]() : ''}
    </MDrawer>
  );
};
