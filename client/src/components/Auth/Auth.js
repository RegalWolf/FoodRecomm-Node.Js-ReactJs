import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';

import * as actions from '../../store/actions/index';

class Auth extends Component {
  state = {
    loginForm: {
      username: {
        id: 'username',
        value: '',
        isValid: false,
        warning: {
          status: false,
          text: ''
        }
      },
      password: {
        id: 'password',
        value: '',
        isValid: false,
        warning: {
          status: false,
          text: ''
        }
      }
    },
    formIsValid: false,
    redirectUrl: null,
    isSignIn: false
  }

  inputChangedHandler = (e, id) => {
    const updatedLoginForm = {
      ...this.state.loginForm
    }
    const updatedElementForm = {
      ...updatedLoginForm[id]
    }
    updatedElementForm.value = e.target.value;
    updatedElementForm.isValid = updatedElementForm.value !== '';
    updatedElementForm.warning.status = updatedElementForm.value === '';
    updatedLoginForm[id] = updatedElementForm;

    let formIsValid = true;

    for (let id in updatedLoginForm) {
      formIsValid = updatedLoginForm[id].isValid && formIsValid;
    }

    this.setState({
      loginForm: updatedLoginForm,
      formIsValid: formIsValid
    });
  }

  submitLoginHandler = async () => {
    // if (this.state.formIsValid) {
    await this.props.onAuth(this.state.loginForm.username.value, this.state.loginForm.password.value);

    if (this.props.error) {
      const loginForm = { ...this.state.loginForm };

      if (this.props.error.username && this.props.error.password) {
        loginForm.username.warning.status = true;
        loginForm.username.warning.text = this.props.error.username;

        loginForm.password.warning.status = true;
        loginForm.password.warning.text = this.props.error.password;
      } else if (this.props.error.username) {
        loginForm.username.warning.status = true;
        loginForm.username.warning.text = this.props.error.username;
      } else if (this.props.error.password) {
        loginForm.password.warning.status = true;
        loginForm.password.warning.text = this.props.error.password;
      }
  
      this.setState({loginForm: loginForm});
    }
  }

  enteredHandler = e => {
    if (e.key === 'Enter') {
      this.submitLoginHandler();
    }
  }

  render() {
    // warning alert
    const usernameWarning = { ...this.state.loginForm.username.warning }; 
    const passwordWarning = { ...this.state.loginForm.password.warning };

    let authRedirect = null;
    if (this.props.token) {
      authRedirect = <Redirect to='/' />
    }

    return (
      <div style={styles.login}>
        <div style={styles.loginBox}>
          <Typography style={styles.title} variant="h4">
            FoodRecomm
          </Typography>
          <Typography style={styles.subheading} variant="subtitle1">
            Selamat datang! silahkan login untuk masuk
          </Typography>
          
          {authRedirect}
          <form style={styles.form} noValidate autoComplete="off">
            <TextField
              id={this.state.loginForm.username.id}
              label={this.state.loginForm.username.id}
              helperText={usernameWarning.status 
                ? usernameWarning.text
                : null}
              error={usernameWarning.status 
                ? true
                : false}
              margin="normal"
              autoFocus={this.state.loginForm.username.warning.status}
              style={styles.textfield}
              onChange={(e) => this.inputChangedHandler(e, this.state.loginForm.username.id)}
            />
            <TextField
              id={this.state.loginForm.password.id}
              label={this.state.loginForm.password.id}
              helperText={passwordWarning.status 
                ? passwordWarning.text 
                : null}
              error={passwordWarning.status 
                ? true 
                : false}
              style={styles.textfield}
              type="password"
              autoComplete="current-password"
              margin="normal"
              autoFocus={this.state.loginForm.password.warning.status}
              onChange={(e) => this.inputChangedHandler(e, this.state.loginForm.password.id)}
              onKeyPress={this.enteredHandler}
            />

            <div style={styles.buttonGroup}>
              <Button 
                variant="contained" 
                color="inherit" 
                style={styles.submitButton}
                onClick={this.submitLoginHandler}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const styles = {
  login: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBox: {
    paddingBottom: '4rem',
    textAlign: 'center',
    maxWidth: '25rem',
    padding: '2rem',
  },
  title: {
    letterSpacing: '.25rem',
    fontWeight: '600',
    color: '#43425D',
  },
  subheading: {
    marginTop: '.5rem',
    color: '#43425D',
  },
  form: {
    marginTop: '1rem',
  },
  textfield: {
    width: '100%',
    color: '#43425D',
  },
  FormControlLabel: {
    textAlign: 'left',
    background: 'red',
  },
  buttonGroup: {
    margin: '2rem 0',
  },
  link: {
    textDecoration: 'none',
  },
  submitButton: {
    backgroundColor: '#43425D', 
    color: '#fff',
    width: '100%'
  }
};

const mapStateToProps = state => {
  return {
    token: state.authReducer.token,
    error: state.authReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password) => dispatch(actions.auth(username, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
