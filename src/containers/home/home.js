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

    /*
    @ handler sel botón de testing
    */
    // handleClick () {
    //     room.emit("message", {
    //         type: 'asesoria:request',
    //         data: ''
    //     })
    // }

    handleClickRequest () {
        room.emit("message", {
            type: 'asesoria:start',
            data: ''
        })
    }
    /*
    @ messageHandler
    Maneja los mensajes que llegan desde el WebSocket
    @ Entradas:
        - message: Mensaje que arribó al socket.
    @ Proceso: Manejo de eventos según type.
    */
    messageHandler ( message ) {
        const {type, data} = message
        switch (type) {
            case 'asesoria:request':
                this.setState({request: true})
                break;
            case 'asesoria:start':
                this.props.history.push("videollamada/someId");
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
    # Consideraciones (TODO?): 
        - La data debe ser fetcheada desde el back:
            - id_topic
            - token (al momento de login)
        - Para asegurar una conexión única al topic usar this.props.socket.ws.getSubscription(id_topic) el cual retorna un objeto para hacer "emit"
    */
    handleChange( e ) {
        const id_topic = 'someId';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU3MjEyMTg4MH0.zNoVLpQcmGQDCjF6pt3RgTTxHh3D-4XxYGx0OohGDoM';
        this.setState ({ disponible : e.target.checked});
        if (e.target.checked) {
            this.props.socket.connect();
            //subscribe retorna una subscripción al topic que tiene el método "emit" que permite enviar datos
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