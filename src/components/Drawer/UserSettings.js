import React, { useContext, useState, useEffect } from 'react';
import * as style from './Drawer.module.scss';
import { makeStyles } from '@material-ui/core/styles';
import { MarkersContext } from '../../providers/MapMarkersProvider';
import { UserDetailsContext } from '../../providers/UserDetailsProvider';
import { Divider, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExploreIcon from '@material-ui/icons/Explore';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useApi } from '../../customHooks/useApi';
import Chip from '@material-ui/core/Chip';
import { EditItemModal } from '../ActionsBar/EditItem';
import { tiles } from '../../providers/MapMarkersProvider/markersConfig';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Labels } from './UserMatchesList';
const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: '10px',
  },
}));

const cap = (word) => word[0].toUpperCase() + word.substring(1);

export const UserSettingsPanel = ({ showAlert }) => {
  const { markers, setCenter, refreshMarkers, tileUrl, setTile } = useContext(
    MarkersContext
  );
  const { userDetails } = useContext(UserDetailsContext);
  const [openPanels, setOpenPanels] = useState({});
  const [activeId, setActiveId] = useState({});
  const { callApi } = useApi('', { method: 'delete', invokeManually: true });

  const getDescription = (t) => {
    const threshold = 45;
    return t.length > threshold ? t.slice(0, threshold) + '...' : t;
  };
  const handleDeleteClick = (id) => () => {
    callApi({}, `/items/${id}`).then(() => {
      refreshMarkers();
      showAlert({
        msg: `Successfully deleted ${id}`,
        type: 'success',
      });
    });
  };

  const handleEditClick = (id) => () => {
    console.log(id);
    setActiveId(id);
  };
  const togglePanel = (key) => () => {
    if (openPanels[key]) {
      setOpenPanels((p) => ({ ...p, [key]: !p[key] }));
      return;
    }
    setOpenPanels((p) => ({ ...p, [key]: true }));
  };
  const isPanelOpen = (key) => openPanels[key];
  const classes = useStyles();

  const handleRadioChange = (e) => {
    setTile(e.target.value);
  };
  const getUsersMarkers = () =>
    markers.filter((m) => m.reporter.id === userDetails.googleId);
  console.log(tileUrl);
  return (
    <div>
      <DrawersTitle pageName={'User settings'} />
      <div className={style.settingsPanel}>
        <div className={style.userDetails}>
          <Tooltip title={userDetails.name}>
            <Avatar className={style.avatar}>
              {userDetails.givenName[0] + userDetails.familyName[0]}
            </Avatar>
          </Tooltip>
          <Typography>{userDetails.email}</Typography>
        </div>
        <Divider />

        <Divider />
        <List>
          <ListItem button onClick={togglePanel('map_settings')}>
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="Map Settings" />
            {isPanelOpen('map_settings') ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            in={isPanelOpen('map_settings')}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItem>
                <RadioGroup value={tileUrl} onChange={handleRadioChange}>
                  {tiles.map((t) => (
                    <FormControlLabel
                      value={t.url}
                      control={<Radio />}
                      label={cap(t.name)}
                    />
                  ))}
                </RadioGroup>
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={togglePanel('manage_entries_settings')}>
            <ListItemIcon>
              <EditLocationIcon />
            </ListItemIcon>
            <ListItemText primary="Manage User Entries" />
            {isPanelOpen('manage_entries_settings') ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItem>
          <Collapse
            in={isPanelOpen('manage_entries_settings')}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {getUsersMarkers().map((m) => (
                <ListItem button>
                  <EditItemModal
                    handleClose={() => {
                      setActiveId(null);
                    }}
                    id={m._id}
                    isOpen={activeId === m._id}
                    entryType={m.entryType}
                  />
                  <LostOrFoundLabel type={m.entryType} />
                  <Labels labels={m.labels} />
                  <ListItemText primary={getDescription(m.description)} />
                  <Fab
                    size="small"
                    color="primary"
                    aria-label="edit"
                    className={classes.root}
                    onClick={handleEditClick(m._id)}
                  >
                    <EditIcon />
                  </Fab>
                  <Fab
                    size="small"
                    color="secondary"
                    aria-label="delete"
                    onClick={handleDeleteClick(m._id)}
                  >
                    <DeleteIcon />
                  </Fab>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </div>
    </div>
  );
};
export const LostOrFoundLabel = ({ type = '' }) => {
  return (
    <Chip
      className={`${style.chip} ${type === 'found' ? style.found : ''}`}
      label={type.toUpperCase()}
      color={type === 'found' ? 'primary' : 'secondary'}
    />
  );
};

export const DrawersTitle = ({ pageName = '' }) => (
  <div className={style.title}>
    <Typography variant="h5">LOST AND SPOTTINGS</Typography>
    <Typography style={{ fontWeight: 'bold' }}>{pageName}</Typography>
  </div>
);
