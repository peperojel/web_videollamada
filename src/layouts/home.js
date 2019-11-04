import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
// import routes from '../routes/sidebarRoutes'
// import Dashboard from '../containers/asesoriaEnCurso/asesoriaEnCurso';
// import ProximasAsesorias from '../containers/proximasAsesorias/proximasAsesorias';
// import HistorialAsesorias from '../containers/historialAsesorias/historialAsesorias';
// import Agenda from '../containers/agenda/agenda';
// import avatarimg from '../assets/images/avatar.jpg'
import {
    // ListItemIcon,
    // ListItemText,
    Divider,
    // IconButton,
    List,
    ListItem,
    Drawer,
    CssBaseline,
    Toolbar,
    AppBar,
    Typography,
    // ListSubheader,
    // Avatar,
    //ListItemAvatar,
} from '@material-ui/core';
// import Estadisticos from '../containers/estadisticos/estadisticos';
// import Configuracion from '../containers/configuracion/configuracion';

const drawerWidth = 280;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        backgroundColor: 'white',
        color: '#707070'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));


function Home(props) {
    const {
        title,
        disponible,
        component,
        setComponent,
        activeRoute,
        handleChange,
        handleClick,
        handleClickRequest,
        request
    } = props;
    const classes = useStyles();
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
    });

    /*
    Si hay un request se muestra el "pop-up" de solicitud. Solo permite aceptar en esta implementación
    */
    let requestComp;
    if(request) {
        requestComp = <ListItem>
        <Fragment>Solicitud de videollamada!</Fragment>
        <Button 
            variant="contained"
            className={classes.button}
            onClick={() => handleClickRequest()}>
            Aceptar
        </Button>
    </ListItem>;
    } else { requestComp = null}

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.root}>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            MEDITEL WEB
                    </Typography>
                    </Toolbar>
                    <Divider />
                    <List>
                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={disponible}
                                        onChange= {e => handleChange(e)}
                                        color="primary"
                                    />
                                }
                                label="Disponibilidad"
                            />
                        </ListItem>
                        {requestComp}
                        {/* <ListItem>
                            <Button 
                                variant="contained"
                                className={classes.button}
                                onClick={() => handleClick()}>
                                Test
                            </Button>
                            <Fragment>Your text here</Fragment>;
                        </ListItem> */}
                    </List>
                    <Divider />
                </Drawer>
            </div>            
        </div>
    )
}

export default Home;