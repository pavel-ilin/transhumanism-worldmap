import React, { Fragment } from 'react';
import { decode, encode } from 'base-64'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import WorldMap from './components/WorldMap'
import Login from './components/Login'
import Admin from './components/Admin'

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const App = (props) => {
  return (
    <Fragment>
      <Switch>
        <Route exact path='/'><Redirect to='/map' /></Route>
        <Route path="/map"><WorldMap /></Route>
        <Route path="/login"><Login /></Route>
        {props.user && <Route path="/admin"><Admin /></Route>}
        {props.user && <Redirect to='/admin' />}
      </Switch>
    </Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user.user
  };
};

export default connect(mapStateToProps)(App);
