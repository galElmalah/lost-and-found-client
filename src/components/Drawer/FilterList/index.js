import React from 'react';
import { MarkersContext } from '../../../providers/MapMarkersProvider/index';
import Axios from 'axios';
import * as style from './FilterList.module.scss';

import throttle from 'lodash/throttle';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Slider,
  TextField,
} from '@material-ui/core';
import { ColorPicker } from '../../Utility';
import { UserDetailsContext } from '../../../providers/UserDetailsProvider/index';
import { DrawerContext } from '..';
import { DrawersTitle } from '../UserSettings';

const toggleFilters = [
  {
    value: 'LOSTS',
    title: 'losts',
    subtitle: 'show only losts entries',
  },
  {
    value: 'FOUNDS',
    title: 'founds',
    subtitle: 'show only founds entries',
  },
  {
    value: 'USER_ENTRIES',
    title: 'my entries',
    subtitle: 'show only entries reported by me',
  },
];

export const FilterList = React.memo(
  () => {
    const {
      incBadgeCount,
      decBadgeCount,
      filterState,
      setFilterState,
    } = React.useContext(DrawerContext);
    const { userDetails, labels } = React.useContext(UserDetailsContext);
    const { setMarkers } = React.useContext(MarkersContext);
    const [toggels, setToggels] = React.useState(filterState.toggels || {});
    const [activeLabels, setActiveLabels] = React.useState(
      filterState.activeLabels || []
    );
    const [range, setRange] = React.useState(filterState.range || 15);
    React.useEffect(() => {
      if (
        filterState.toggels &&
        Object.keys(filterState.toggels) > Object.keys(toggels)
      ) {
        decBadgeCount('filter');
      }
      if (
        filterState.toggels &&
        Object.keys(filterState.toggels) < Object.keys(toggels)
      ) {
        incBadgeCount('filter');
      }

      setFilterState((p) => {
        return { ...p, toggels };
      });
    }, [toggels]);
    React.useEffect(() => {
      if (
        filterState.activeLabels &&
        filterState.activeLabels.length > activeLabels.length &&
        activeLabels.length === 0
      ) {
        decBadgeCount('filter');
      }
      if (
        filterState.activeLabels &&
        filterState.activeLabels.length < activeLabels.length &&
        activeLabels.length === 1
      ) {
        console.log('shit');
        incBadgeCount('filter');
      }
      setFilterState((p) => {
        return { ...p, activeLabels };
      });
    }, [activeLabels]);
    React.useEffect(() => {
      setFilterState((p) => {
        return { ...p, range };
      });
    }, [range]);
    const ref = React.useRef(
      throttle((query) => {
        Axios.get(`http://localhost:3001/items${query}`).then(({ data }) => {
          setMarkers(data);
        });
      }, 300)
    ).current;

    const buildQuery = () => {
      const toggelsQuery = Object.entries(toggels)
        .filter(([key, val]) => val)
        .map(([key, val]) => `${key.toLowerCase()}=${val}`)
        .join('&');
      const labelsQuery = activeLabels.length
        ? `labels=${activeLabels.join(',')}`
        : '';

      return `?range=${range}&${toggelsQuery}${
        labelsQuery ? `&${labelsQuery}` : ''
      }`;
    };

    React.useEffect(() => {
      ref(buildQuery());
    }, [toggels, activeLabels, range]);

    return (
      <div className={style.filtersCon}>
        <DrawersTitle pageName="Filters" />
        <List className={'slide-filter-bar'}>
          <ListSubheader>Range Selector (radius in km)</ListSubheader>

          <ListItem>
            <Slider
              value={range}
              min={0}
              step={0.1}
              max={200}
              valueLabelFormat={(v) => v}
              scale={(x) => x ** 10}
              onChange={(e, nv) => setRange(nv)}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
          </ListItem>

          <ListSubheader>Toggle Filters</ListSubheader>
          {toggleFilters.map(({ title, subtitle, value }) => (
            <>
              <ListItem dense button>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={toggels[value]}
                    disableRipple
                    onChange={() => {
                      if (value === 'USER_ENTRIES') {
                        if (toggels[value]) {
                          setToggels((prevToggels) => ({
                            ...prevToggels,
                            [value]: prevToggels[value]
                              ? false
                              : userDetails.googleId,
                          }));
                          return;
                        }
                        setToggels((prevToggels) => ({
                          ...prevToggels,
                          [value]: userDetails.googleId,
                        }));
                        return;
                      }
                      if (toggels[value]) {
                        setToggels((prevToggels) => ({
                          ...prevToggels,
                          [value]: !prevToggels[value],
                        }));
                        return;
                      }
                      setToggels((prevToggels) => ({
                        ...prevToggels,
                        [value]: true,
                      }));
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={title} secondary={subtitle} />
              </ListItem>
              <Divider />
            </>
          ))}
          <ListSubheader>Categories</ListSubheader>
          <ListItem>
            <Autocomplete
              multiple
              className={style.autocomplete}
              id="tags-outlined"
              onChange={(e, selected) =>
                setActiveLabels(selected.map((_) => _.title))
              }
              value={activeLabels.map((l) => ({ title: l }))}
              options={Object.values(labels)
                .reduce((acc, n) => [...acc, ...n], [])
                .map((v) => ({ title: v }))}
              getOptionLabel={(option) => option.title}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="filterSelectedOptions"
                  placeholder="categories"
                />
              )}
            />
          </ListItem>
          <ListSubheader>Colors</ListSubheader>
          <ListItem>
            <ColorPicker />
          </ListItem>
        </List>
      </div>
    );
  },
  () => true
);
