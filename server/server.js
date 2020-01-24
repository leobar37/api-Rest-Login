//archivo de configuracion 
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

/*=============================================
=            configuraciones            =
=============================================*/
app.use(express.static(path.resolve(__dirname, '../public')))
app.set('port' , process.env.PORT || 8888);

/*=====  End of configuraciones  ======*/

/*=============================================
=            middlewares            =
=============================================*/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/*=====  End of middlewares  ======*/
/*----------  rutas  ----------*/
app.use(require('./routes/index'));

/*=============================================
=            configuracion de base de datos            =
=============================================*/
mongoose.connect(process.env.urlDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex : true,
/* para poder modifcar un elemento es necesario desabilitar useFindAndModify = false */
  useFindAndModify: false
},(error)=> {
    if(error) throw error;
    console.log('base de datos conectada');
});
/*=====  End of configuracion de base de datos  ======*/

app.listen(app.get('port'), ()=>{
  console.log('listen in port'+app.get('port'));
});

