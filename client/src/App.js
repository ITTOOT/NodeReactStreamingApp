import React from 'react';

// Get frontend components
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from "react-router-dom";
import Home from './Home';
import Player from './Player';
import './App.css';

// Frontend entry point
function App() {
  return (
    <Router>
        <Switch>
        {/* Passed to the Home component */}
        <Route exact path="/" component={Home}></Route>
        {/* Dynamic ID component matches anything with the corresponding pattern */}
        {/* and passes to the Player component */}
        <Route path="/player/:id" component={Player}></Route>
        </Switch>
    </Router>
  );
}

//App - "npm start" opens the app in browser0
export default App;
