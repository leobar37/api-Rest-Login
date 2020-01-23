const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

//enumeraciones
/** 
 * a propieaaes num tinene como 
 * objeto a values( keys  permitida)
 * message : mensae
*/
/**
 *variable enum 
*/ 
let roles =  {
    values : ['admin','normal','USER_ROLE'],
    message :'rol no valido'
}

let schemaUsuario = new Schema({
    nombre: {
         type : String,
         required: [true ,'El nombre es requerido']
    },
    email :{
        unique :true,
        type : String,
        required: [true ,'El email es requerido']
    },
    password:{
        type : String,
        required: [true ,'La contraseña es requerida']
    },
     img: {
        type : String  
     },
     role:{
         type :String,
        default: 'USER_ROLE',
        enum : roles
        
     },
     estado:{
        type :Boolean,
        
     },
     google:{
         type :Boolean
     }

   
});
schemaUsuario.plugin(uniqueValidator, {message: '{PATH} es requerido' });

schemaUsuario.methods.toJSON = function(){
     
let user  = this;
let userObject  = user.toObject();
delete  userObject.password;
return  userObject;
} 


//exportando el modelo de moongose
/* la parte del schema solo es un cascaron 
 necesitamos importarlo  
*/
module.exports = mongoose.model('usuario',schemaUsuario);
