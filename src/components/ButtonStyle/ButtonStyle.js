import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import * as s from '../ActionsBar/ActionsBar.module.scss';

export default function Hook(props) {
  return (
    <button onClick={props.clickHandler} className={s.btn}>
      {props.text}
    </button>
  );
}
