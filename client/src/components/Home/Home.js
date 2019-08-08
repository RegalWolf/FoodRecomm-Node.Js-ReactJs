import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Typography } from '@material-ui/core';

import FolderIcon from '@material-ui/icons/Folder';

import classes from './Home.module.css';

class Home extends Component {
  state = {
    data: [
      'makanan',
      'kategori',
      'prioritas'
    ]
  }

  render() {
    const datas = this.state.data.map(nama => (
      <div className={classes.box} key={nama}>
        <Link to={'/' + nama} className={classes.data}>
          <FolderIcon className={classes.icon} />
          <Typography className={classes.text}>{nama}</Typography>
        </Link>
      </div>
    ));

    return (
      <div className={classes.home}>
        {datas}
      </div>
    );
  }
}

export default Home;