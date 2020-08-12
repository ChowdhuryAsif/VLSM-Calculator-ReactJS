import React from 'react';
import { Route } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Home} />
      <Route exact path="/dashboard" component={Dashboard} />
    </div>
  );
}

export default App;
