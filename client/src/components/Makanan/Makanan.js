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
import AddMakanan from './AddMakanan/AddMakanan';
import AddMakananMessage from './AddMakanan/AddMakananMessage';
import UpdateMakanan from './UpdateMakanan/UpdateMakanan';
import UpdateMakananMessage from './UpdateMakanan/UpdateMakananMessage';
import DeleteMakanan from './DeleteMakanan/DeleteMakanan';
import DeleteMakananMessage from './DeleteMakanan/DeleteMakananMessage';
import Spinner from '../Spinner/Spinner';

function createData(makanan_id, nama, kalori, protein, lemak, karbohidrat, kalsium, 
  fosfor, zat_besi, vit_a, vit_b1, vit_c, kategori, prioritas) {
  return { makanan_id, nama, kalori, protein, lemak, karbohidrat, kalsium, fosfor, 
    zat_besi, vit_a, vit_b1, vit_c, kategori, prioritas };
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
  { id: 'makanan_id', numeric: false, disablePadding: true, label: 'Id' },
  { id: 'nama', numeric: false, disablePadding: false, label: 'Nama Makanan' },
  { id: 'kalori', numeric: false, disablePadding: false, label: 'Kalori' },
  { id: 'protein', numeric: false, disablePadding: false, label: 'Protein' },
  { id: 'lemak', numeric: false, disablePadding: false, label: 'Lemak' },
  { id: 'karbohidrat', numeric: false, disablePadding: false, label: 'Karbohidart' },
  { id: 'kalsium', numeric: false, disablePadding: false, label: 'Kalsium' },
  { id: 'fosfor', numeric: false, disablePadding: false, label: 'Fosfor' },
  { id: 'zat_besi', numeric: false, disablePadding: false, label: 'Zat Besi' },
  { id: 'vit_a', numeric: false, disablePadding: false, label: 'Vitamin A' },
  { id: 'vit_b1', numeric: false, disablePadding: false, label: 'Vitamin B1' },
  { id: 'vit_c', numeric: false, disablePadding: false, label: 'Vitamin C' },
  { id: 'kategori', numeric: false, disablePadding: false, label: 'Kategori' },
  { id: 'prioritas', numeric: false, disablePadding: false, label: 'Prioritas' }
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
            Tabel Makanan
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

class Makanan extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'id',
    selected: [],
    data: [],
    makanan: [],
    kategori: [],
    prioritas: [],
    add: {
      open: false,
      openMessage: false,
      sukses: '',
      input: {
        nama: '',
        kalori: '',
        protein: '',
        lemak: '',
        karbohidrat: '',
        kalsium: '',
        fosfor: '',
        zat_besi: '',
        vit_a: '',
        vit_b1: '',
        vit_c: '',
        kategori: '',
        prioritas: ''
      },
      inputMessage: {
        nama: '',
        kalori: '',
        protein: '',
        lemak: '',
        karbohidrat: '',
        kalsium: '',
        fosfor: '',
        zat_besi: '',
        vit_a: '',
        vit_b1: '',
        vit_c: '',
        kategori: '',
        prioritas: ''
      }
    },
    update: {
      open: false,
      openMessage: false,
      sukses: '',
      input: {
        nama: '',
        kalori: '',
        protein: '',
        lemak: '',
        karbohidrat: '',
        kalsium: '',
        fosfor: '',
        zat_besi: '',
        vit_a: '',
        vit_b1: '',
        vit_c: '',
        kategori: '',
        prioritas: ''
      },
      inputMessage: {
        nama: '',
        kalori: '',
        protein: '',
        lemak: '',
        karbohidrat: '',
        kalsium: '',
        fosfor: '',
        zat_besi: '',
        vit_a: '',
        vit_b1: '',
        vit_c: '',
        kategori: '',
        prioritas: ''
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
    await this.props.onFetchKategori(this.state.token);
    await this.props.onFetchPrioritas(this.state.token);

    this.setState({
      kategori: this.props.kategori,
      prioritas: this.props.prioritas
    });
  }

  componentDidUpdate() {
    if (this.state.makanan !== this.props.makanan) {
      this.setState({
        data: [],
        makanan: this.props.makanan,
        loading: this.props.loading
      });
      this.props.makanan.map(dataMakanan => {
        this.setState(prevState => ({
          data: [
            ...prevState.data,
            createData(dataMakanan.makanan_id, dataMakanan.nama, dataMakanan.kalori, dataMakanan.protein,
              dataMakanan.lemak, dataMakanan.karbohidrat, dataMakanan.kalsium, dataMakanan.fosfor, 
              dataMakanan.zat_besi, dataMakanan.vit_a, dataMakanan.vit_b1, dataMakanan.vit_c, 
              dataMakanan.kode_kategori, dataMakanan.prioritas)
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

  isSelected = makanan_id => this.state.selected.indexOf(makanan_id) !== -1;

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
          nama: '',
          kalori: '',
          protein: '',
          lemak: '',
          karbohidrat: '',
          kalsium: '',
          fosfor: '',
          zat_besi: '',
          vit_a: '',
          vit_b1: '',
          vit_c: '',
          kategori: '',
          prioritas: ''
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
    let nama = '';
    let kalori = ''
    let protein = '';
    let lemak = '';
    let karbohidrat = '';
    let kalsium = '';
    let fosfor = ''
    let zat_besi = '';
    let vit_a = ''
    let vit_b1 = '';
    let vit_c = '';
    let kategori = '';
    let prioritas = '';

    nama = this.props.addError.nama;
    kalori = this.props.addError.kalori;
    protein = this.props.addError.protein;
    lemak = this.props.addError.lemak;
    karbohidrat = this.props.addError.karbohidrat;
    kalsium = this.props.addError.kalsium;
    fosfor = this.props.addError.fosfor;
    zat_besi = this.props.addError.zat_besi;
    vit_a = this.props.addError.vit_a;
    vit_b1 = this.props.addError.vit_b1;
    vit_c = this.props.addError.vit_c;
    kategori = this.props.addError.kategori;
    prioritas = this.props.addError.prioritas;

    this.setState(prevState => ({
      add: {
        ...prevState.add,
        inputMessage: {
          nama,
          kalori,
          protein,
          lemak,
          karbohidrat,
          kalsium,
          fosfor,
          zat_besi,
          vit_a,
          vit_b1,
          vit_c,
          kategori,
          prioritas
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
    const input = this.state.makanan.filter(dataMakanan => (
      dataMakanan.makanan_id === this.state.selected[0]
    ));

    this.setState(prevState => ({
      update: {
        ...prevState.update,
        open: true,
        input: {
          nama: input[0].nama,
          kalori: input[0].kalori,
          protein: input[0].protein,
          lemak: input[0].lemak,
          karbohidrat: input[0].karbohidrat,
          kalsium: input[0].kalsium,
          fosfor: input[0].fosfor,
          zat_besi: input[0].zat_besi,
          vit_a: input[0].vit_a,
          vit_b1: input[0].vit_b1,
          vit_c: input[0].vit_c,
          kategori: input[0].kode_kategori,
          prioritas: input[0].prioritas
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
          nama: '',
          kalori: '',
          protein: '',
          lemak: '',
          karbohidrat: '',
          kalsium: '',
          fosfor: '',
          zat_besi: '',
          vit_a: '',
          vit_b1: '',
          vit_c: '',
          kategori: '',
          prioritas: ''
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
    let nama = '';
    let kalori = ''
    let protein = '';
    let lemak = '';
    let karbohidrat = '';
    let kalsium = '';
    let fosfor = ''
    let zat_besi = '';
    let vit_a = ''
    let vit_b1 = '';
    let vit_c = '';
    let kategori = '';
    let prioritas = '';

    nama = this.props.updateError.nama;
    kalori = this.props.updateError.kalori;
    protein = this.props.updateError.protein;
    lemak = this.props.updateError.lemak;
    karbohidrat = this.props.updateError.karbohidrat;
    kalsium = this.props.updateError.kalsium;
    fosfor = this.props.updateError.fosfor;
    zat_besi = this.props.updateError.zat_besi;
    vit_a = this.props.updateError.vit_a;
    vit_b1 = this.props.updateError.vit_b1;
    vit_c = this.props.updateError.vit_c;
    kategori = this.props.updateError.kategori;
    prioritas = this.props.updateError.prioritas;

    this.setState(prevState => ({
      update: {
        ...prevState.update,
        inputMessage: {
          nama,
          kalori,
          protein,
          lemak,
          karbohidrat,
          kalsium,
          fosfor,
          zat_besi,
          vit_a,
          vit_b1,
          vit_c,
          kategori,
          prioritas
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
    const makanan_id = this.state.selected[0] ? this.state.selected[0].toString() : '1';

    await this.props.onUpdate(makanan_id, this.state.token, this.state.update.input);

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
    const makanan_id = this.state.selected[0];

    await this.props.onDelete(makanan_id, this.state.token);
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
          ? <AddMakananMessage 
              sukses={this.state.add.sukses}
              closed={this.toggleMessageAddHandler}
            />
          : null
        }

        {this.state.add.open 
          ? <AddMakanan 
              closeAddHandler={this.closeAddHandler}
              input={this.state.add.input}
              inputMessage={this.state.add.inputMessage}
              changed={this.inputAddHandler} 
              save={this.saveAddHandler}
              kategori={this.state.kategori}
              prioritas={this.state.prioritas}
            /> 
          : null
        }

        {this.state.update.openMessage
          ? <UpdateMakananMessage 
              closed={this.toggleMessageUpdateHandler} 
              sukses={this.state.update.sukses}
            />
          : null
        }

        {this.state.update.open 
          ? <UpdateMakanan 
              closed={this.closeUpdateHandler}
              input={this.state.update.input}
              inputMessage={this.state.update.inputMessage}
              changed={this.inputUpdateHandler} 
              save={this.saveUpdateHandler}
              kategori={this.state.kategori}
              prioritas={this.state.prioritas}
            /> 
          : null
        }

        {this.state.delete.openMessage
          ? <DeleteMakananMessage 
              closed={this.toggleMessageDeleteHandler} 
              sukses={this.state.delete.sukses}
              error={this.state.delete.error}
            />
          : null
        }

        <DeleteMakanan 
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
                    const isSelected = this.isSelected(n.makanan_id);
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.makanan_id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.makanan_id}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {n.makanan_id}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.nama}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.kalori}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {n.protein}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.lemak}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.karbohidrat}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {n.kalsium}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.fosfor}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.zat_besi}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.vit_a}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {n.vit_b1}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.vit_c}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="default">
                          {n.kategori}
                        </TableCell>

                        <TableCell component="td" scope="row" padding="default">
                          {n.prioritas}
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

Makanan.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    makanan: state.makananReducer.makanan,
    kategori: state.kategoriReducer.kategori,
    prioritas: state.prioritasReducer.prioritas,
    add: state.makananReducer.add,
    update: state.makananReducer.update,
    delete: state.makananReducer.delete,
    loading: state.makananReducer.loading,
    addError: state.makananReducer.add.error,
    addSukses: state.makananReducer.add.sukses,
    updateError: state.makananReducer.update.error,
    updateSukses: state.makananReducer.update.sukses,
    deleteError: state.makananReducer.delete.error,
    deleteSukses: state.makananReducer.delete.sukses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetch: token => dispatch(actions.fetchMakanan(token)),
    onFetchKategori: token => dispatch(actions.fetchKategori(token)),
    onFetchPrioritas: token => dispatch(actions.fetchPrioritas(token)),
    onPost: (makanan, token) => dispatch(actions.postMakanan(makanan, token)),
    onDelete: (id, token) => dispatch(actions.deleteMakanan(id, token)),
    onUpdate: (id, token, makanan) => dispatch(actions.updateMakanan(id, token, makanan))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Makanan));
