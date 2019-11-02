import React from 'react'
import VideoCall from '../helpers/simple-peer'
import '../styles/video.css'
import { getDisplayStream } from '../helpers/media-access';
import ShareScreenIcon from './ShareScreenIcon';

class Video extends React.Component {
  constructor() {
    super()
    this.state = {
      localStream: {},
      remoteStreamUrl: '',
      streamUrl: '',
      initiator: false,
      full: false,
      connecting: false,
      waiting: true
    }

    this.signalHandler = this.signalHandler.bind(this);
  }

  videoCall = new VideoCall()

  componentDidMount() {

    this.props.socket.setHandler(this.signalHandler)
    this.room = this.props.socket.ws.getSubscription(this.props.socket.topic);

    // getUserMedia
    this.getUserMedia().then(() => {
      this.room.emit('message', {
        type: 'asesoria:ready',
        data: ''
      })
    })
    //TODO: Qué ocurre cuando el otro par se desconecta
    // socket.on('disconnected', () => {
    //   component.setState({ initiator: true })
    // })
  }

  signalHandler ( message ) {
    const {type, data} = message
    switch (type) {
        case 'asesoria:ready':
          if (!this.state.hasOwnProperty('peer')) {
            this.startVideollamada();
          }
          break;
        case 'asesoria:signaling':
          this.state.peer.signal(data)
          break;
        case 'asesoria:initiator':
          this.setState({initiator: true})
        default:
          console.log("Default case")
        break;
      }
}

  getUserMedia(cb) {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      const op = {
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 }
        },
        audio: true
      }
      navigator.getUserMedia(
        op,
        stream => {
          this.setState({ streamUrl: stream, localStream: stream })
          this.localVideo.srcObject = stream
          resolve()
        },
        () => {}
      )
    })
  }

  getDisplay(){
    getDisplayStream().then(stream => {
      stream.oninactive = () => {
        this.state.peer.removeStream(this.state.localStream)  
        this.getUserMedia().then(() => {
          this.state.peer.addStream(this.state.localStream)  
        })
      }
      this.setState({ streamUrl: stream, localStream: stream })
      this.localVideo.srcObject = stream   
      this.state.peer.addStream(stream)   
    })
  }

  startVideollamada = () => {
    this.setState({ connecting: true })
    const peer = this.videoCall.init(
      this.state.localStream,
      this.state.initiator
    )
    this.setState({peer})
    // TODO: Se debe adaptar a la nueva lógica del WebSocket
    peer.on('signal', data => {
      console.log("[Evento Signal] Enviando data...", data)
      this.room.emit('message', {
        type: 'asesoria:signaling',
        data: data
      })
    });

    peer.on('stream', stream => {
      this.remoteVideo.srcObject = stream
      this.setState({ connecting: false, waiting: false })
    })
    peer.on('error', function(err) {
      console.log(err)
    })
  }

  call = otherId => {
    this.videoCall.connect(otherId)
  }
  renderFull = () => {
    if (this.state.full) {
      return 'The room is full'
    }
  }
  render() {
    return (
      <div className="video-wrapper">
        <div className="local-video-wrapper">
          <video
            autoPlay
            id="localVideo"
            muted
            ref={video => (this.localVideo = video)}
          />
        </div>
        <video
          autoPlay
          className={`${
            this.state.connecting || this.state.waiting ? 'hide' : ''
          }`}
          id="remoteVideo"
          ref={video => (this.remoteVideo = video)}
        />
        <button className="share-screen-btn" onClick={() => {
          this.getDisplay()
        }}><ShareScreenIcon/></button>
        {this.state.connecting && (
          <div className="status">
            <p>Establishing connection...</p>
          </div>
        )}
        {this.state.waiting && (
          <div className="status">
            <p>Waiting for someone...</p>
          </div>
        )}
        {this.renderFull()}
      </div>
    )
  }
}

export default Video
