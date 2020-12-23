import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import Home from './pages/home/Home';
import Market from './pages/market/Market';

import './App.scss';

function App() {
  return (
    <ChakraProvider>
      <div className='app'>
        <Router>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route exact path='/market/:marketId'>
              <Market />
            </Route>
          </Switch>
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
