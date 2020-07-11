import * as React from 'react';
import * as style from './Utility.module.scss';
import { TwitterPicker } from 'react-color';

export const ColorPicker = ({
  handleChangeComplete = console.log,
  className,
  width = '276px',
}) => {
  const colors = [
    '#FF6900',
    '#FCB900',
    '#7BDCB5',
    '#00D084',
    '#8ED1FC',
    '#0693E3',
    '#ABB8C3',
    '#EB144C',
    '#F78DA7',
    '#9900EF',
    '#795548',
    '#000000',
  ];
  return (
    <TwitterPicker
      className={className}
      triangle="hide"
      onChangeComplete={handleChangeComplete}
      colors={colors}
      width={width}
    ></TwitterPicker>
  );
};
