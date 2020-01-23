//========================
//  port 
//========================

//process.env.PORT =  process.env.PORT ||  8888;

//========================
//  ENTORNO
//========================

 
process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

//========================
//  expiracion
//========================
process.env.CADUCIDADTOKEN =60 * 60 * 24 * 30 ;

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
