const mongoose  = require('mongoose');
const uniqueValidator  = require('mongoose-unique-validator');
//variable Schema
const Schema = mongoose.Schema;

let SchemaCategoria = new Schema({

    nombre : { 
      type :String, 
      required : true
    },
    estado : { 
        type : Boolean,
        default :  true
    },
    usuario : { type:mongoose.Types.ObjectId , ref: 'usuario' }

});



module.exports  = mongoose.model('categoria', SchemaCategoria);