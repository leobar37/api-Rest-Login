//========================
//  port 
//========================

//process.env.PORT =  process.env.PORT ||  8888;

//========================
//  ENTORNO
//========================

 
process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

/*=============================================
=            google id            =
=============================================*/
process.env.CLIENT_ID = process.env.CLIENT_ID || '792650140448-pr64fgoo3hr96r5lv1798n867pi60kg2.apps.googleusercontent.com';
/*=====  End of google id  ======*/

//========================
//  expiracion
//========================
process.env.CADUCIDADTOKEN ='48h' ;

//========================
//  seed
//========================
process.env.SEED =  process.env.SEED  || 'see-de-desarrollo';
//========================
//  Base de datos
//========================

let urlDb ;

 if(process.env.NODE_ENV === 'dev'){
    urlDb = 'mongodb://localhost:27017/cafe';
 }else{
   urlDb = process.env.MONGO_URI;
 }

process.env.urlDb = urlDb; 

