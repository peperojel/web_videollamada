import Ws from '@adonisjs/websocket-client';

//import { getSocketProtocol } from '../utils/data';

export default class SocketConnection {

  constructor () {
    this.handler = null;
  }

  setHandler (handler) {
    this.handler = handler
  }
  //TODO: Darle el token como argumento
  connect () {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMyLCJpYXQiOjE1NzI4MzI4NzB9.-SQDvLhHF0z2OIn6SAUoMp5Aasp0SnX9vh7z7cChiRQ';
    this.ws = Ws('wss://meditel-testing.herokuapp.com')
    .withApiToken(token)
      .connect();

    this.ws.on('open', () => {
      console.log('Connection initialized')
    });

    this.ws.on('close', () => {
      console.log('Connection closed')
    });

    return this
  }

  close () {
    this.ws.close();
  }

  subscribe (channel) {
    if (!this.ws) {
      setTimeout(() => this.subscribe(channel), 1000)
    } else {
      const result = this.ws.subscribe(channel);

      result.on('message', message => {
        console.log('Incoming', message);
        this.handler(message)
      });

      result.on('error', (error) => {
        console.error(error)
      });

      return result
    }
  }
}
