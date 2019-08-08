import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import Navigation from './components/Navigation/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <React.Fragment>
        <Switch>
          <Route path="/login" exact component={Auth} />
          <Route path='/' component={Navigation} />
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
