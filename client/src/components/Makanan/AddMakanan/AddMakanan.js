import React from 'react';

import { 
  Typography, Button, TextField, Tooltip, Paper, IconButton,
  FormControl, FormHelperText, Select, MenuItem
} from '@material-ui/core';

import CloseItem from '@material-ui/icons/Close';

import classes from '../FormInput.module.scss';

const addMakanan = props => {
  return (
    <Paper style={styles.container}>
      <div style={styles.contentHeader}>
        <Typography variant='h6'>
          Tambah Makanan
        </Typography>
        <Tooltip title='Tutup' onClick={props.closeAddHandler}>
          <IconButton aria-label='Tutup'>
            <CloseItem />
          </IconButton>
        </Tooltip>
      </div>
      <div style={styles.contentBody}>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="nama"
            label="Nama Makanan"
            value={props.input.nama}
            onChange={props.changed('nama')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.nama 
            ? <FormHelperText>{props.inputMessage.nama}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="kalori"
            label="Kalori"
            value={props.input.kalori}
            onChange={props.changed('kalori')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.kalori 
            ? <FormHelperText>{props.inputMessage.kalori}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="protein"
            label="Protein"
            value={props.input.protein}
            onChange={props.changed('protein')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.protein 
            ? <FormHelperText>{props.inputMessage.protein}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="lemak"
            label="Lemak"
            value={props.input.lemak}
            onChange={props.changed('lemak')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.lemak 
            ? <FormHelperText>{props.inputMessage.lemak}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="karbohidrat"
            label="Karbohidrat"
            value={props.input.karbohidrat}
            onChange={props.changed('karbohidrat')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.karbohidrat 
            ? <FormHelperText>{props.inputMessage.karbohidrat}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="kalsium"
            label="Kalsium"
            value={props.input.kalsium}
            onChange={props.changed('kalsium')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.kalsium 
            ? <FormHelperText>{props.inputMessage.kalsium}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="fosfor"
            label="Fosfor"
            value={props.input.fosfor}
            onChange={props.changed('fosfor')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.fosfor 
            ? <FormHelperText>{props.inputMessage.fosfor}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="zat_besi"
            label="Zat Besi"
            value={props.input.zat_besi}
            onChange={props.changed('zat_besi')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.zat_besi 
            ? <FormHelperText>{props.inputMessage.zat_besi}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="vit_a"
            label="Vitamin A"
            value={props.input.vit_a}
            onChange={props.changed('vit_a')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.vit_a 
            ? <FormHelperText>{props.inputMessage.vit_a}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="vit_b1"
            label="Vitamin B1"
            value={props.input.vit_b1}
            onChange={props.changed('vit_b1')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.vit_b1 
            ? <FormHelperText>{props.inputMessage.vit_b1}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl error style={styles.textFieldNormal}>
          <TextField
            id="vit_c"
            label="Vitamin C"
            value={props.input.vit_c}
            onChange={props.changed('vit_c')}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          {props.inputMessage.vit_c 
            ? <FormHelperText>{props.inputMessage.vit_c}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl className={classes.textField2}>
          <Typography variant='caption' className={classes.textField2__caption}>Kategori Makanan</Typography>
          <Select
            value={props.input.kategori}
            onChange={props.changed('kategori')}
            displayEmpty
            name='kategori'
          >
            {props.kategori.map(dataKategori => (
              <MenuItem 
                key={dataKategori.kode_kategori} 
                value={dataKategori.kode_kategori}
              >
                {dataKategori.kode_kategori + " - " + dataKategori.nama_kategori}
              </MenuItem>
            ))}
          </Select>
          {props.inputMessage.kategori 
            ? <FormHelperText error style={{marginTop: '1rem'}}>{props.inputMessage.kategori}</FormHelperText>
            : null
          }
        </FormControl>
        <FormControl className={classes.textField2}>
          <Typography variant='caption' className={classes.textField2__caption}>Prioritas Makanan</Typography>
          <Select
            value={props.input.prioritas}
            onChange={props.changed('prioritas')}
            displayEmpty
            name='prioritas'
          >
            {props.prioritas.map(dataPrioritas => (
              <MenuItem 
                key={dataPrioritas.prioritas} 
                value={dataPrioritas.prioritas}
              >
                {dataPrioritas.prioritas}
              </MenuItem>
            ))}
          </Select>
          {props.inputMessage.prioritas 
            ? <FormHelperText error style={{marginTop: '1rem'}}>{props.inputMessage.prioritas}</FormHelperText>
            : null
          }
        </FormControl>
      </div>
      <div style={styles.contentNavigation}>
        <Button onClick={props.closeAddHandler}>
          Cancel
        </Button>
        <Button onClick={props.save}>
          Save
        </Button>
      </div>
    </Paper>
  );
};

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
  }
};

export default addMakanan;