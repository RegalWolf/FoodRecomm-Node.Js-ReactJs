import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Spinner from '../../Spinner/Spinner';

const deleteMakanan = props => (
  <Dialog
    open={props.open}
    onClose={props.onToggleAlert}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <div style={{position: 'relative'}}>
      <DialogTitle id="alert-dialog-title">Hapus Makanan?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Data ini akan terhapus dari database, apakah Anda yakin?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onToggleAlert} color="primary">
          Cancel
        </Button>
        
        <Button onClick={props.deleted} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>

      {props.loading ? <Spinner /> : null}
    </div>
  </Dialog>
);

const mapStateToProps = state => {
  return {
    loading: state.makananReducer.loading
  };
};

export default connect(mapStateToProps)(deleteMakanan);