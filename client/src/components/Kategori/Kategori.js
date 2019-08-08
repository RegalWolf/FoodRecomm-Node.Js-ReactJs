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
import AddKategori from './AddKategori/AddKategori';
import AddKategoriMessage from './AddKategori/AddKategoriMessage';
import UpdateKategori from './UpdateKategori/UpdateKategori';
import UpdateKategoriMessage from './UpdateKategori/UpdateKategoriMessage';
import DeleteKategori from './DeleteKategori/DeleteKategori';
import DeleteKategoriMessage from './DeleteKategori/DeleteKategoriMessage';
import Spinner from '../Spinner/Spinner';

function createData(kode_kategori, nama_kategori, deskripsi) {
  return { kode_kategori, nama_kategori, deskripsi };
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
  { id: 'kode_kategori', numeric: false, disablePadding: true, label: 'Kode Kategori' },
  { id: 'nama_kategori', numeric: false, disablePadding: false, label: 'Nama Kategori' },
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
            Tabel Kategori
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

class Kategori extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'id',
    selected: [],
    data: [],
    kategori: [],
    add: {
      open: false,
      openMessage: false,
      sukses: '',
      input: {
        kode_kategori: '',
        nama_kategori: '',
        deskripsi: ''
      },
      inputMessage: {
        kode_kategori: '',
        nama_kategori: '',
        deskripsi: ''
      }
    },
    update: {
      open: false,
      openMessage: false,
      sukses: '',
      input: {
        kode_kategori: '',
        nama_kategori: '',
        deskripsi: ''
      },
      inputMessage: {
        kode_kategori: '',
        nama_kategori: '',
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
    if (this.state.kategori !== this.props.kategori) {
      this.setState({
        data: [],
        kategori: this.props.kategori,
        loading: this.props.loading
      });
      this.props.kategori.map(dataKategori => {
        this.setState(prevState => ({
          data: [
            ...prevState.data,
            createData(dataKategori.kode_kategori, dataKategori.nama_kategori, dataKategori.deskripsi)
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
          kode_kategori: '',
          nama_kategori: '',
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
    let kode_kategori = '';
    let nama_kategori = ''
    let deskripsi = '';

    kode_kategori = this.props.addError.kode_kategori;
    nama_kategori = this.props.addError.nama_kategori;
    deskripsi = this.props.addError.deskripsi;

    this.setState(prevState => ({
      add: {
        ...prevState.add,
        inputMessage: {
          kode_kategori,
          nama_kategori,
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
    const input = this.state.kategori.filter(dataKategori => (
      dataKategori.kode_kategori === this.state.selected[0]
    ));

    console.log(input);

    this.setState(prevState => ({
      update: {
        ...prevState.update,
        open: true,
        input: {
          kode_kategori: input[0].kode_kategori,
          nama_kategori: input[0].nama_kategori,
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
          kode_kategori: '',
          nama_kategori: '',
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
    let kode_kategori = '';
    let nama_kategori = ''
    let deskripsi = '';

    kode_kategori = this.props.updateError.kode_kategori;
    nama_kategori = this.props.updateError.nama_kategori;
    deskripsi = this.props.updateError.deskripsi;

    this.setState(prevState => ({
      update: {
        ...prevState.update,
        inputMessage: {
          kode_kategori,
          nama_kategori,
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
    const kodeKategori = this.state.selected[0] ? this.state.selected[0].toString() : '1';

    await this.props.onUpdate(kodeKategori, this.state.token, this.state.update.input);

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
    const kodeKategori = this.state.selected[0];

    await this.props.onDelete(kodeKategori, this.state.token);
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
          ? <AddKategoriMessage 
              sukses={this.state.add.sukses}
              closed={this.toggleMessageAddHandler}
            />
          : null
        }

        {this.state.add.open 
          ? <AddKategori 
              closeAddHandler={this.closeAddHandler}
              input={this.state.add.input}
              inputMessage={this.state.add.inputMessage}
              changed={this.inputAddHandler} 
              save={this.saveAddHandler}
            /> 
          : null
        }

        {this.state.update.openMessage
          ? <UpdateKategoriMessage 
              closed={this.toggleMessageUpdateHandler} 
              sukses={this.state.update.sukses}
            />
          : null
        }

        {this.state.update.open 
          ? <UpdateKategori 
              closed={this.closeUpdateHandler}
              input={this.state.update.input}
              inputMessage={this.state.update.inputMessage}
              changed={this.inputUpdateHandler} 
              save={this.saveUpdateHandler}
            /> 
          : null
        }

        {this.state.delete.openMessage
          ? <DeleteKategoriMessage 
              closed={this.toggleMessageDeleteHandler} 
              sukses={this.state.delete.sukses}
              error={this.state.delete.error}
            />
          : null
        }

        <DeleteKategori 
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
                    const isSelected = this.isSelected(n.kode_kategori);
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.kode_kategori)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.kode_kategori}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {n.kode_kategori}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.nama_kategori}
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

Kategori.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    kategori: state.kategoriReducer.kategori,
    add: state.kategoriReducer.add,
    update: state.kategoriReducer.update,
    delete: state.kategoriReducer.delete,
    loading: state.kategoriReducer.loading,
    addError: state.kategoriReducer.add.error,
    addSukses: state.kategoriReducer.add.sukses,
    updateError: state.kategoriReducer.update.error,
    updateSukses: state.kategoriReducer.update.sukses,
    deleteError: state.kategoriReducer.delete.error,
    deleteSukses: state.kategoriReducer.delete.sukses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetch: token => dispatch(actions.fetchKategori(token)),
    onPost: (kategori, token) => dispatch(actions.postKategori(kategori, token)),
    onDelete: (kodeKategori, token) => dispatch(actions.deleteKategori(kodeKategori, token)),
    onUpdate: (kodeKategori, token, kategori) => dispatch(actions.updateKategori(kodeKategori, token, kategori))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Kategori));
