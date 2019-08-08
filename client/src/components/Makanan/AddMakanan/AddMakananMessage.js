import React from 'react';

import { Paper, IconButton, Icon, Typography } from '@material-ui/core';

import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';

const addMakananMessage = props => (
  <Paper style={props.sukses ? styles.success : styles.warning}>
    <div style={styles.message}>
      <Icon style={styles.icon}>
        {props.sukses ? <CheckCircleIcon /> : <WarningIcon />}
      </Icon>
      <Typography color='inherit' style={styles.messageText}>
        {props.sukses}
      </Typography>
    </div>
    <IconButton color='inherit' onClick={props.closed}>
      <CloseIcon />
    </IconButton>
  </Paper>
);

const styles = {
  success: {
    background: 'green',
    padding: '.25rem .5rem .25rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    marginBottom: '1.5rem',
  },
  warning: {
    background: 'orangered',
    padding: '.25rem .5rem .25rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    marginBottom: '1.5rem',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '1rem',
  },
  messageText: {
    paddingTop: '.25rem'
  }
}

export default addMakananMessage;