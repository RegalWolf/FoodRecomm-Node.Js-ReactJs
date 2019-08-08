import React from 'react';

import { 
  Typography, Button, TextField, Tooltip, Paper, IconButton,
  FormControl, FormHelperText
} from '@material-ui/core';

import CloseItem from '@material-ui/icons/Close';

const updateKategori = props => (
  <Paper style={styles.container}>
    <div style={styles.contentHeader}>
      <Typography variant='h6'>
        Ubah Kategori
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
          id="kode_kategori"
          label="Kode Kategori"
          value={props.input.kode_kategori}
          onChange={props.changed('kode_kategori')}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        {props.inputMessage.kode_kategori 
          ? <FormHelperText>{props.inputMessage.kode_kategori}</FormHelperText>
          : null
        }
      </FormControl>
      <FormControl error style={styles.textFieldNormal}>
        <TextField
          id="nama_kategori"
          label="Nama Kategori"
          value={props.input.nama_kategori}
          onChange={props.changed('nama_kategori')}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        {props.inputMessage.nama_kategori 
          ? <FormHelperText>{props.inputMessage.nama_kategori}</FormHelperText>
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

export default updateKategori;