import './Loto.css';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import React from 'react';
import Loto from './component/Loto';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './component/Register';
import Login from './component/Login';
import Home from './component/Home';
import Statistika from './component/Statistika';
import Landing from './component/Landing';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/statistika' component={Statistika} />
        <Route exact path='/profile' component={Loto} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/home' component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
