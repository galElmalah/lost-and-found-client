import * as React from 'react';
import * as style from './TopBadges.module.scss';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import FilterListIcon from '@material-ui/icons/FilterList';
import { DrawerContext, drawers } from '../Drawer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export const TopBadges = () => {
  const { setOpenDrawer, badgeCount } = React.useContext(DrawerContext);
  return (
    <div className={style.badgesContaier}>
      <Badge
        color="primary"
        badgeContent={badgeCount['filter']}
        className={style.item}
      >
        <FilterListIcon
          color="action"
          onClick={() => {
            setOpenDrawer(drawers.FILTER);
          }}
        />
      </Badge>
      <Badge color="secondary" className={style.item}>
        <NotificationsNoneIcon
          color="action"
          onClick={() => {
            setOpenDrawer(drawers.MATCH);
          }}
        />
      </Badge>

      <Badge
        color="secondary"
        className={style.item}
        onClick={() => {
          setOpenDrawer(drawers.SETTINGS);
        }}
      >
        <AccountCircleIcon color="action" />
      </Badge>
    </div>
  );
};
