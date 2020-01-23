//archivo de configuracion 
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
/* paquete body parser 
 sirve para serializar las 
 peticiones post 
*/
app.set('port' , process.env.PORT || 8888);

///middlewares
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//rutas 

//ruta para el usuario 
app.use(require('./routes/index'));


//===========base de datos moongose=====================

 mongoose.connect(process.env.urlDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex : true,
  //para poder modifcar un elemento es necesario desabilitar useFindAndModify = false
  useFindAndModify: false
},(error)=> {
    if(error) throw error;
    console.log('base de datos conectada');
});
//puerto 
app.listen(app.get('port'), ()=>{
  console.log('listen in port'+app.get('port'));
});

