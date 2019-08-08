import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { HashRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import Makanan from './../Makanan/Makanan';
import Kategori from './../Kategori/Kategori';
import Prioritas from './../Prioritas/Prioritas';
import Home from './../Home/Home';
import * as actions from './../../store/actions/index';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#3D3C54',
    color: '#fff'
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    width: '100%'
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    width: 100,
    maxWidth: `calc(100%-240px)`,
  },
});

class PersistentDrawerLeft extends React.Component {
  state = {
    open: false,
    submenuData: false,
    datas: [
      'makanan',
      'kategori',
      'prioritas'
    ]
  };

  async componentDidMount() {
    const token = localStorage.getItem('token');

    if (!token) {
      return this.props.history.push('/login');
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  submenuHandler = () => {
    this.setState(prevState => {
      return {submenuData: !prevState.submenuData};
    });
  }

  onLogout = () => {
    this.props.onLogout();
    
    this.props.history.push('/login');
  }

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;

    const datasMenu = this.state.datas;

    let datas = datasMenu.map(data => (
      <NavLink 
        to={'/' + data} 
        exact 
        key={data}
        className='navLink'
        activeClassName='navLinkActive'
      >
        <ListItem button>
          <ListItemIcon style={{color: 'transparent'}}>
            <MenuIcon /> 
          </ListItemIcon>
          <ListItemText primary={data} />
        </ListItem>
      </NavLink>
    ));

    return (
      <Router>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
            })}
            color='inherit'
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap>
                FoodRecomm - Food Recommendation
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <NavLink 
                to='/' 
                exact
                className='navLink'
                activeClassName='navLinkActive'
              >
                <ListItem button style={{paddingTop: '.25rem', paddingBottom: '.25rem'}}>
                  <ListItemIcon>
                    <HomeIcon /> 
                  </ListItemIcon>
                  <ListItemText primary='Home' />
                </ListItem>
              </NavLink>
              <ListItem button onClick={this.submenuHandler}>
                <ListItemIcon>
                  <DataUsageIcon /> 
                </ListItemIcon>
                <ListItemText primary='Data' />
              </ListItem>
              <div style={{display: this.state.submenuData ? 'block' : 'none'}}>
                {datas}
              </div>
            </List>
            <Divider />
            <List>
              <ListItem button onClick={this.onLogout}>
                <ListItemIcon>
                  <PowerSettingsNewIcon /> 
                </ListItemIcon>
                <ListItemText primary='Logout' />
              </ListItem>
            </List>
          </Drawer>
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            <div className={classes.drawerHeader} />
            <Switch>
              <Route path='/makanan' exact component={Makanan} />
              <Route path='/kategori' exact component={Kategori} />
              <Route path='/prioritas' exact component={Prioritas} />
              <Route path='/' exact component={Home} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(PersistentDrawerLeft));

