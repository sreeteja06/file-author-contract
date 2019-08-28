/*
 * SPDX-License-Identifier: Apache-2.0
 *     _____________  ___  
      / ___/ ___/ _ \/ _ \ 
     (__  ) /  /  __/  __/ 
    /____/_/   \___/\___  
 * File Created: Saturday, 24th August 2019 11:23:18 am
 * Author: SreeTeja06 (sreeteja.muthyala@gmail.com)

 */
import React, { Component } from "react";
import { Route, Switch } from 'react-router-dom';
import "./App.css";
import DigNotary from "./components/DigNotary/DigNotary";
import DigDocSign from "./components/DigDocSign/DigDocSign";

class App extends Component {

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={DigNotary} />
          <Route path="/digdocsign" exact component={DigDocSign} />
        </Switch>
      </div>
    );
  }
}

export default App;
