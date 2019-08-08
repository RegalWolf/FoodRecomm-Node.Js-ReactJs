import React from 'react';

import { 
  Typography, Button, TextField, Tooltip, Paper, IconButton,
  FormControl, FormHelperText
} from '@material-ui/core';

import CloseItem from '@material-ui/icons/Close';

const updatePrioritas = props => (
  <Paper style={styles.container}>
    <div style={styles.contentHeader}>
      <Typography variant='h6'>
        Ubah Prioritas
      </Typography>
      <Tooltip title='close' onClick={props.closed}>
        <IconButton aria-label='close'>
          <CloseItem />
        </IconButton>
      </Tooltip>
    </div>
    <div style={styles.contentBody}>
      <FormControl error style={styles.textFieldNormal}>
        <TextField
          id="prioritas"
          label="Prioritas"
          value={props.input.prioritas}
          onChange={props.changed('prioritas')}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        {props.inputMessage.prioritas 
          ? <FormHelperText>{props.inputMessage.prioritas}</FormHelperText>
          : null
        }
      </FormControl>
      <FormControl error style={styles.textFieldNormal}>
        <TextField
          id="tingkat_prioritas"
          label="Tingkat Prioritas"
          value={props.input.tingkat_prioritas}
          onChange={props.changed('tingkat_prioritas')}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        {props.inputMessage.tingkat_prioritas 
          ? <FormHelperText>{props.inputMessage.tingkat_prioritas}</FormHelperText>
          : null
        }
      </FormControl>
      <FormControl error style={styles.textFieldBig}>
        <TextField
          id="deskripsi"
          label="Deskripsi"
          value={props.input.deskripsi}
          onChange={props.changed('deskripsi')}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        {props.inputMessage.deskripsi 
          ? <FormHelperText>{props.inputMessage.deskripsi}</FormHelperText>
          : null
        }
      </FormControl>
    </div>
    <div style={styles.contentNavigation}>
      <Button onClick={props.closed}>
        Cancel
      </Button>
      <Button onClick={props.save}>
        Save
      </Button>
    </div>
  </Paper>
);

const styles = {
  container: {
    marginBottom: '1.5rem',
    overflow: 'hidden'
  },
  contentHeader: {
    padding: '.75rem .5rem .75rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentBody: {
    padding: '.75rem 1.5rem'
  },
  contentNavigation: {
    padding: '.75rem 1.5rem',
    textAlign: 'right'
  },
  textFieldNormal: {
    width: '20%',
    marginRight: '1rem'
  },
  textFieldBig: {
    width: '40%'
  }
};

export default updatePrioritas;