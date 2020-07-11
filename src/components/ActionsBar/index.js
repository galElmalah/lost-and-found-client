import React, { useState, useContext } from 'react';
import * as style from './ActionsBar.module.scss';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { DatePicker } from '@material-ui/pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { MarkersContext } from '../../providers/MapMarkersProvider/index';
import DateFnsUtils from '@date-io/date-fns';
import { ColorPicker } from '../Utility';
import ButtonStyle from '../ButtonStyle/ButtonStyle';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import InputLabel from '@material-ui/core/InputLabel';
import { UserDetailsContext } from '../../providers/UserDetailsProvider';

export const ActionsBar = ({ showAlert }) => {
  const [openModal, setOpenModal] = useState(null);
  return (
    <div className={style.actionsBar}>
      <FoundModal
        showAlert={showAlert}
        isOpen={openModal === 'found'}
        handleClose={() => setOpenModal(null)}
      />
      <LostModal
        showAlert={showAlert}
        isOpen={openModal === 'lost'}
        handleClose={() => setOpenModal(null)}
      />

      <ButtonStyle text="found" clickHandler={() => setOpenModal('found')}>
        {' '}
      </ButtonStyle>
      <ButtonStyle text="lost" clickHandler={() => setOpenModal('lost')}>
        {' '}
      </ButtonStyle>
    </div>
  );
};

export const TransitionsModal = ({ isOpen, handleClose, children = '' }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      className={style.modal}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>{children}</Fade>
    </Modal>
  );
};

const FoundModal = ({ isOpen, handleClose, showAlert }) => (
  <TransitionsModal isOpen={isOpen} handleClose={handleClose}>
    <ItemForm
      showAlert={showAlert}
      title={'Found Something'}
      entryType={'found'}
      handleClose={handleClose}
    />
  </TransitionsModal>
);

const LostModal = ({ isOpen, handleClose, showAlert }) => (
  <TransitionsModal isOpen={isOpen} handleClose={handleClose}>
    <ItemForm
      showAlert={showAlert}
      title={'Lost Something'}
      entryType={'lost'}
      handleClose={handleClose}
    />
  </TransitionsModal>
);

const ItemForm = ({ entryType, handleClose, title, showAlert }) => {
  const { labels } = useContext(UserDetailsContext);
  const {
    enableDraggableMarker,
    disableDraggableMarker,
    addMarker,
    initialPosition,
    draggableMarkerPosition,
  } = useContext(MarkersContext);
  const [useCurrentLocation, setUseCurrentLocation] = useState(
    draggableMarkerPosition ? false : true
  );
  const [name, setName] = React.useState('');
  const [activeLabel, setActiveLabel] = React.useState('');
  const [selectedDate, handleDateChange] = useState(new Date());
  const [description, setDescription] = React.useState('');
  const [color, setColor] = React.useState('');
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleChangeComplete = (color, event) => {
    setColor(color.hex);
  };

  const resetForm = () => {
    setDescription('');
    setName('');
    disableDraggableMarker();
  };

  const list = () => {
    const comps = [];
    Object.entries(labels).forEach(([key, values]) => {
      comps.push(<ListSubheader>{key}</ListSubheader>);
      values.forEach((v) => comps.push(<MenuItem value={v}>{v}</MenuItem>));
    });

    return comps;
  };

  return (
    <div className={style.modalContent}>
      <h2>{title}</h2>
      <form className={style.form} noValidate autoComplete="off">
        {useCurrentLocation ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={useCurrentLocation}
                onClick={() => setUseCurrentLocation((_) => !_)}
                color="primary"
              />
            }
            label="Use my location"
          />
        ) : (
          <Button
            onClick={() => {
              enableDraggableMarker();
              handleClose();
            }}
          >
            Select a location using the map
          </Button>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InputLabel shrink>Date</InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils} fullWidth>
              <DatePicker
                value={selectedDate}
                fullWidth
                onChange={handleDateChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel shrink>Category</InputLabel>
            <Select
              fullWidth
              defaultValue="None"
              id="grouped-select"
              value={activeLabel}
              onChange={(e) => {
                setActiveLabel(e.target.value);
              }}
            >
              {list()}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handleDescriptionChange}
              value={description}
              required
              id="standard-textarea"
              label="Item description"
              placeholder="Description"
              multiline
              fullWidth
            />
          </Grid>
          <ColorPicker
            width="100%"
            handleChangeComplete={handleChangeComplete}
          ></ColorPicker>
        </Grid>
        <div className={style.btns}>
          <Button
            onClick={() => {
              if (description) {
                addMarker({
                  name,
                  description,
                  entryType,
                  location: useCurrentLocation
                    ? initialPosition
                    : [
                        draggableMarkerPosition.lat,
                        draggableMarkerPosition.lng,
                      ],
                  lostOrFoundAt: selectedDate.toUTCString(),
                  color,
                  labels: [activeLabel || 'other'],
                });
                showAlert({
                  msg: 'Entry created successfully!',
                  entryType: 'success',
                });
                resetForm();
                handleClose();
              } else {
                showAlert({
                  msg: 'Description is mandatory field!',
                  type: 'error',
                });
              }
            }}
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              resetForm();
              handleClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
