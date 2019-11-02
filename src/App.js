import React, { Component } from 'react';
import Video from './components/video'
import './App.css';
import './styles/video.css'
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './containers/home/home';
import SocketConnection from './lib/socket';

// Se crea una instancia única de Ws que será alimentada a los componentes que la requieran
const ws = new SocketConnection();

class App extends Component {

  render() {
    return (
      <BrowserRouter>
       <React.Fragment>
          <Route path="/home" exact render={props => <Home {...props} socket={ws} />} />
          <Route path="/videollamada/:roomId" exact render={props => <Video {...props} socket={ws} />}/>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;
