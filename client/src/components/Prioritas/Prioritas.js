import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { 
  Table, TableBody, TableCell,TableHead, TablePagination, TableRow, TableSortLabel, 
  Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';

import * as actions from '../../store/actions/index';
import AddPrioritas from './AddPrioritas/AddPrioritas';
import AddPrioritasMessage from './AddPrioritas/AddPrioritasMessage';
import UpdatePrioritas from './UpdatePrioritas/UpdatePrioritas';
import UpdatePrioritasMessage from './UpdatePrioritas/UpdatePrioritasMessage';
import DeletePrioritas from './DeletePrioritas/DeletePrioritas';
import DeletePrioritasMessage from './DeletePrioritas/DeletePrioritasMessage';
import Spinner from '../Spinner/Spinner';

function createData(prioritas, tingkat_prioritas, deskripsi) {
  return { prioritas, tingkat_prioritas, deskripsi };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'prioritas', numeric: false, disablePadding: true, label: 'Prioritas' },
  { id: 'tigkat_prioritas', numeric: false, disablePadding: false, label: 'Tingkat Prioritas' },
  { id: 'deskripsi', numeric: false, disablePadding: false, label: 'Deskripsi' }
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" />
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
                size='small'
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'flex',
  },
  title: {
    flex: '0 0 auto',
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography id="tableTitle" variant='h6'>
            Tabel Prioritas
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected === 1 ? (
          <React.Fragment>
            <Tooltip title="Ubah" onClick={props.openUpdateHandler}>
              <IconButton aria-label="Ubah">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Hapus" onClick={props.openDeleteHandler}>
              <IconButton aria-label="Hapus">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Tooltip title="Refresh" onClick={props.onRefresh}>
              <IconButton aria-label="Refresh">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tambah" onClick={props.openAddHandler}>
              <IconButton aria-label="Tambah">
                <AddIcon />
              </IconButton>
            </Tooltip>
          </React.Fragment>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired, 
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
  },
  table: {
    width: '100%'
  },
  tableWrapper: {
    overflowX: 'auto',
    position: 'relative'
  },
});

class Prioritas extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'id',
    selected: [],
    data: [],
    prioritas: [],
    add: {
      open: false,
      openMessage: false,
      sukses: '',
      input: {
        prioritas: '',
        tingkat_prioritas: '',
        deskripsi: ''
      },
      inputMessage: {
        prioritas: '',
        tingkat_prioritas: '',
        deskripsi: ''
      }
    },
    update: {
      open: false,
      openMessage: false,
      sukses: '',
      input: {
        prioritas: '',
        tingkat_prioritas: '',
        deskripsi: ''
      },
      inputMessage: {
        prioritas: '',
        tingkat_prioritas: '',
        deskripsi: ''
      }
    },
    delete: {
      open: false,
      error: null,
      sukses: null,
      openMessage: false
    },
    page: 0,
    rowsPerPage: 10,
    token: localStorage.getItem('token'),
    loading: false
  };

  async componentDidMount() {
    const token = await localStorage.getItem('token');

    if (!token) {
      return;
    }

    this.props.onFetch(this.state.token);
  }

  componentDidUpdate() {
    if (this.state.prioritas !== this.props.prioritas) {
      this.setState({
        data: [],
        prioritas: this.props.prioritas,
        loading: this.props.loading
      });
      this.props.prioritas.map(dataPrioritas => {
        this.setState(prevState => ({
          data: [
            ...prevState.data,
            createData(dataPrioritas.prioritas, dataPrioritas.tingkat_prioritas, dataPrioritas.deskripsi)
          ] 
        }))
      });
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected[0] = id;
    } else {
      newSelected = [];
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  unselectHandler = () => {
    this.setState({
      selected: []
    });
  }

  refreshHandler = () => {
    this.props.onFetch(this.state.token);
  }

  // ------------------- Add Function ---------------------
  openAddHandler = () => {
    this.setState(prevState => ({
      add: {
        ...prevState.add,
        open: true
      }
    }));
  }

  closeAddHandler = () => {
    this.setState(prevState => ({
      add: {
        ...prevState.add,
        open: false
      }
    }));
  }

  inputAddHandler = id => event => {
    const value = event.target.value;
    const name = [id][0];

    this.setState(prevState => ({
      add: {
        ...prevState.add,
        input: {
          ...prevState.add.input,
          [name]: value
        }
      }
    }));
  }

  resetInputAddHandler = () => {
    this.setState(prevState => ({
      add: {
        ...prevState.add,
        input: {
          prioritas: '',
          tingkat_prioritas: '',
          deskripsi: ''
        }
      }
    }));
  }

  toggleMessageAddHandler = () => {
    this.setState(prevState => ({
      add: {
        ...prevState.add,
        openMessage: !prevState.add.openMessage
      }
    }));

    if (this.state.add.openMessage) {
      setTimeout(() => {
        this.setState(prevState => ({
          add: {
            ...prevState.add,
            openMessage: false
          }
        }));
      }, 3000);
    }
  }

  addValidationHandler = () => {
    let prioritas = '';
    let tingkat_prioritas = '';
    let deskripsi = '';

    prioritas = this.props.addError.prioritas;
    tingkat_prioritas = this.props.addError.tingkat_prioritas;
    deskripsi = this.props.addError.deskripsi;

    this.setState(prevState => ({
      add: {
        ...prevState.add,
        inputMessage: {
          prioritas,
          tingkat_prioritas,
          deskripsi
        }
      }
    }));
  }

  messageAddHandler = () => {
    this.setState(prevState => ({
      add: {
        ...prevState.add,
        sukses: this.props.addSukses
      }
    }));
  }

  saveAddHandler = async () => {
    await this.props.onPost(this.state.add.input, this.state.token);

    if (this.props.addError) {
      return this.addValidationHandler();
    }

    this.closeAddHandler();
    this.resetInputAddHandler();
    this.messageAddHandler();
    this.refreshHandler();
    this.toggleMessageAddHandler();
  }

  // ------------------- Update Function ---------------------

  openUpdateHandler = () => {
    const input = this.state.prioritas.filter(dataPrioritas => (
      dataPrioritas.prioritas === this.state.selected[0]
    ));

    this.setState(prevState => ({
      update: {
        ...prevState.update,
        open: true,
        input: {
          prioritas: input[0].prioritas,
          tingkat_prioritas: input[0].tingkat_prioritas,
          deskripsi: input[0].deskripsi
        }
      }
    }));
  }

  closeUpdateHandler = () => {
    this.setState(prevState => ({
      update: {
        ...prevState.update,
        open: false
      }
    }));
  }

  resetInputUpdateHandler = () => {
    this.setState(prevState => ({
      update: {
        ...prevState.update,
        input: {
          prioritas: '',
          tingkat_prioritas: '',
          deskripsi: ''
        }
      }
    }));
  }

  inputUpdateHandler = id => event => {
    const value = event.target.value;
    const name = [id][0];

    this.setState(prevState => ({
      update: {
        ...prevState.update,
        input: {
          ...prevState.update.input,
          [name]: value
        }
      }
    }));
  }

  updateValidationHandler = () => {
    let prioritas = '';
    let tingkat_prioritas = ''
    let deskripsi = '';

    prioritas = this.props.updateError.prioritas;
    tingkat_prioritas = this.props.updateError.tingkat_prioritas;
    deskripsi = this.props.updateError.deskripsi;

    this.setState(prevState => ({
      update: {
        ...prevState.update,
        inputMessage: {
          prioritas,
          tingkat_prioritas,
          deskripsi
        }
      }
    }));
  }

  toggleMessageUpdateHandler = () => {
    this.setState(prevState => ({
      update: {
        ...prevState.update,
        openMessage: !prevState.update.openMessage
      }
    }));

    if (this.state.update.openMessage) {
      setTimeout(() => {
        this.setState(prevState => ({
          update: {
            ...prevState.update,
            openMessage: false
          }
        }));
      }, 3000);
    }
  }

  messageUpdateHandler = () => {
    this.setState(prevState => ({
      update: {
        ...prevState.update,
        sukses: this.props.updateSukses
      }
    }));
  }
  
  saveUpdateHandler = async () => {
    const prioritas = this.state.selected[0] ? this.state.selected[0].toString() : '1';

    await this.props.onUpdate(prioritas, this.state.token, this.state.update.input);

    if (this.props.updateError) {
      return this.updateValidationHandler();
    }

    this.closeUpdateHandler();
    this.resetInputUpdateHandler();
    this.messageUpdateHandler();
    this.unselectHandler();
    this.refreshHandler();
    this.toggleMessageUpdateHandler();
  }

  // ------------------- Delete Function ---------------------

  toggleDeleteAlertHandler = () => {
    this.setState(prevState => ({
      delete: {
        ...prevState.delete,
        open: !prevState.delete.open
      }
    }));
  }

  toggleMessageDeleteHandler = () => {
    this.setState(prevState => ({
      delete: {
        ...prevState.delete,
        openMessage: !prevState.delete.openMessage
      }
    }));

    if (this.state.delete.openMessage) {
      setTimeout(() => {
        this.setState(prevState => ({
          delete: {
            ...prevState.delete,
            openMessage: false
          }
        }));
      }, 3000);
    }
  }

  messageDeleteHandler = () => {
    this.setState(prevState => ({
      delete: {
        ...prevState.delete,
        error: this.props.deleteError,
        sukses: this.props.deleteSukses
      }
    }));
  }

  deleteHandler = async () => {
    const prioritas = this.state.selected[0];

    await this.props.onDelete(prioritas, this.state.token);
    this.toggleDeleteAlertHandler();
    this.unselectHandler();
    this.refreshHandler();
    this.messageDeleteHandler();
    this.toggleMessageDeleteHandler();
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <React.Fragment>
        {this.state.add.openMessage
          ? <AddPrioritasMessage 
              sukses={this.state.add.sukses}
              closed={this.toggleMessageAddHandler}
            />
          : null
        }

        {this.state.add.open 
          ? <AddPrioritas 
              closeAddHandler={this.closeAddHandler}
              input={this.state.add.input}
              inputMessage={this.state.add.inputMessage}
              changed={this.inputAddHandler} 
              save={this.saveAddHandler}
            /> 
          : null
        }

        {this.state.update.openMessage
          ? <UpdatePrioritasMessage 
              closed={this.toggleMessageUpdateHandler} 
              sukses={this.state.update.sukses}
            />
          : null
        }

        {this.state.update.open 
          ? <UpdatePrioritas 
              closed={this.closeUpdateHandler}
              input={this.state.update.input}
              inputMessage={this.state.update.inputMessage}
              changed={this.inputUpdateHandler} 
              save={this.saveUpdateHandler}
            /> 
          : null
        }

        {this.state.delete.openMessage
          ? <DeletePrioritasMessage 
              closed={this.toggleMessageDeleteHandler} 
              sukses={this.state.delete.sukses}
              error={this.state.delete.error}
            />
          : null
        }

        <DeletePrioritas 
          open={this.state.delete.open}
          onToggleAlert={this.toggleDeleteAlertHandler}
          deleted={this.deleteHandler} />

        <Paper className={classes.root}>
          <EnhancedTableToolbar 
            numSelected={selected.length} 
            openDeleteHandler={this.toggleDeleteAlertHandler}
            openAddHandler={this.openAddHandler}
            openUpdateHandler={this.openUpdateHandler}
            onRefresh={this.refreshHandler}
          />

          <div className={classes.tableWrapper}>
            {this.props.loading ? <Spinner /> : null}

            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.prioritas);
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.prioritas)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.prioritas}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {n.prioritas}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.tingkat_prioritas}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.deskripsi}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </React.Fragment>
    );
  }
}

Prioritas.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    prioritas: state.prioritasReducer.prioritas,
    add: state.prioritasReducer.add,
    update: state.prioritasReducer.update,
    delete: state.prioritasReducer.delete,
    loading: state.prioritasReducer.loading,
    addError: state.prioritasReducer.add.error,
    addSukses: state.prioritasReducer.add.sukses,
    updateError: state.prioritasReducer.update.error,
    updateSukses: state.prioritasReducer.update.sukses,
    deleteError: state.prioritasReducer.delete.error,
    deleteSukses: state.prioritasReducer.delete.sukses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetch: token => dispatch(actions.fetchPrioritas(token)),
    onPost: (prioritas, token) => dispatch(actions.postPrioritas(prioritas, token)),
    onDelete: (prioritas, token) => dispatch(actions.deletePrioritas(prioritas, token)),
    onUpdate: (prioritas, token, DataPrioritas) => dispatch(actions.updatePrioritas(prioritas, token, DataPrioritas))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Prioritas));
