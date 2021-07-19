const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './variables.env' });


//cors permite que un cliente se conecte a otro servidor para el intercambio de recursos
const cors = require('cors');

//crear servidor
const app = express();

//carpeta publica
app.use(express.static('uploads'));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.BD_URL,{
// mongoose.connect('mongodb://localhost/restapis', {
    useNewUrlParser: true
});

//habilitar bodyParser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//definir un dominio para recibir las peticiones
const whitelist = [process.env.FRONTEND_URL];
// const whitelist = ['http://localhost:3000']
const corsOptions = {
    origin: (origin, callback) => {
        //revisar si la peticion viene de un servidor que esta en whitelist
        const existe = whitelist.some(dominio => dominio === origin);
        if (existe) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

//habilitar cors
app.use(cors(corsOptions));

// Configurar cabeceras y cors

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    
    next();
    
    });

//rutas de la app
app.use('/', routes());

//puerto
// app.listen(5000);
const host =process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

//iniciar app
app.listen(port, host, ()=>{
    console.log('El servidor esta funcinando');
})