import React, { Component, Fragment } from 'react'
// import AsesoriaEnCursoContent from '../../components/AsesoriaEnCurso/AsesoriaEnCurso'
import { withRouter } from 'react-router-dom'
// import Sidebar from '../../components/Sidebar/Sidebar'
import Template from '../../layouts/home'

import axios from '../../lib/axios';

let room = null;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component : 'Dashboard',
            title:'Asesoría en curso',
            disponible: false,
            socket: this.props.socket,
            request: false
        }

        this.setComponent = this.setComponent.bind(this);
        this.activeRoute = this.activeRoute.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.messageHandler = this.messageHandler.bind(this);
        //this.testMethod = this.testMethod(this);
    }

    componentDidMount() {
        this.props.socket.setHandler(this.messageHandler)
        console.log("Se ejecutó setHandler!")
    }

    handleClick () {
        room.emit("message", {
            type: 'asesoria:request',
            data: ''
        })
        console.log("Bottom pressed")
    }

    handleClickRequest () {
        room.emit("message", {
            type: 'asesoria:start',
            data: ''
        })
        console.log("Bottom pressed")
    }
    /*
    @ messageHandler
    Maneja los mensajes que llegan desde el WebSocket
    @ Entradas:
        - message: Mensaje que arribó al socket.
    @ Proceso: Si mensaje es solicitud de asesoría se migra a la vista de videollamada
    */
    messageHandler ( message ) {
        const {type, data} = message
        switch (type) {
            case 'asesoria:request':
              this.setState({request: true})
              break;
            case 'asesoria:start':
                this.props.history.push("videollamada/someId");
            
              console.log("Go to videollamada!")
            case 'asesoria:ready':
            //   this.updateState(this.sc,this.socket.topic)
            break;
            default:
              console.log("Default case")
            break;
          }
    }

    activeRoute(componentName) {
        return componentName == this.state.component ? true : false;
    }

    /*
    @ handleChange:
    Se ejecuta cuando el médico cambia su disponibilidad en el slider
    @ Entradas:
        - e : Se rescata e.target.checked que tiene el estado booleano del slider
    @ Proceso:
        - Hace una conexión al socket
        - Se subscribe al canal id_topic
        - Envía un request al backend para cambiar su estado
    #TODO: 
        - Asegurar que quede en modo no disponible cuando cierre la página
        - El id_topic debe ser adquirido desde el backend (método por definir)
    */
    handleChange( e ) {
        const id_topic = 'someId';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU3MjEyMTg4MH0.zNoVLpQcmGQDCjF6pt3RgTTxHh3D-4XxYGx0OohGDoM';
        this.setState ({ disponible : e.target.checked});
        if (e.target.checked) {
            this.props.socket.connect();
            //TODO: USAR Ws.getSubscription(id_topic) para asegurar que exista una única subscripción
            room = this.props.socket.subscribe('asesoria:'+id_topic);
            this.props.socket.topic = 'asesoria:'+id_topic;
        } else {
            this.props.socket.close();
        }

        axios.post(
            '/api/doctor/estado',
            {disponible : e.target.checked},
            {headers : {
                'Authorization' : 'Bearer ' + token
            }})
            .then( response => {
                console.log(response);
            }, (error) => console.log(error))

    }

    setComponent(componentName, navbarName){
        //console.log(componentName);
        //console.log(navbarName);
        this.setState({component:componentName,title:navbarName});
        //console.log(this.state.component);
    }

    render() {
        const {
            component,
            title
        } = this.props;
        return (
            <Fragment>
                <Template
                component = {this.state.component}
                setComponent = {this.setComponent}
                activeRoute = {this.activeRoute}
                handleChange = {this.handleChange}
                handleClick = {this.handleClick}
                handleClickRequest = {this.handleClickRequest}
                disponible = {this.disponible}
                title ={this.state.title}
                request = {this.state.request}
                >
                    
                </Template>
            </Fragment>
        );
    }

}

export default Home;