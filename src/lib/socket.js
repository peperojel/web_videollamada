import Ws from '@adonisjs/websocket-client';

//import { getSocketProtocol } from '../utils/data';

export default class SocketConnection {

  constructor () {
    this.handler = null;
  }

  setHandler (handler) {
    this.handler = handler
  }

  connect () {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU3MjEyMTg4MH0.zNoVLpQcmGQDCjF6pt3RgTTxHh3D-4XxYGx0OohGDoM';
    this.ws = Ws('ws://localhost:3333')
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
