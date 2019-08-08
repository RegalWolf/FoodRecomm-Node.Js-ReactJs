import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    marginTop: 2,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
});

const spinner = props => {
  const { classes } = props;
  return (
    <div className={classes.progress}>
      <CircularProgress size={30} />
    </div>
  );
}

spinner.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(spinner);