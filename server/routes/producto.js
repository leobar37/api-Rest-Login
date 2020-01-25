const  mongoose  = require('mongoose');
const  Producto  =  require('../models/producto');
const   { authorization}    = require('../middlewares/aunthentication');
const _ = require('underscore');
const express = require('express');
const router = express.Router();
/*=============================================
=            servicios             =
=============================================*/
/*
-mostrar todas las categorias ->  get
-mostrar una categoria por id -> get 
-crear una nueva categoria ->  post 
-actualizar una categoria  ->  put
*/
/*=====  End of servicios   ======*/
router.get("/producto", [authorization], (req, res) => {
  let desde = req.query.desde;
  let hasta = req.query.hasta;

  /*  ordenar = sort => sort('atributo por el cual desea ordenar')  */
  desde = Number(desde);
  hasta = Number(hasta);
  Producto.find({}) .sort('nombre').skip(desde).limit(hasta)
    /* populate tambien recibe como segundo argumento
     los atributos que estan permitido 
    .populate('usuario'. 'nombre email') */
     .populate('usuario')
     .populate('categoria')
    .exec((err, docs) => {
      if (err) return res.status(500).json({ ok: false, err });
      if (!docs)
        return res
          .status(400)
          .json({ ok: false, err: "no existen categorias" });

      if (docs) res.status(200).json({ ok: true, docs });
    });
});


router.get("/producto/:id", [authorization], (req, res) => {
 
    let id  =  req.params.id;
      
     Producto.findById( id ,(err, producto)=>{
          if (err) return res.status(500).json({ ok: false, err });
          if (!producto)
            return res
              .status(400)
              .json({ ok: false, err: "no existen esta producto"});
            
       if(producto) res.status(200).json({  ok :  true,  producto });

     } );


});

router.post('/producto' , [authorization], (req, res)=>{
 
   let body =   req.body;
   let usuario  =  req.usuario;
  
   let producto = new Producto({
      nombre: body.nombre,
       precioUni :  body.precioUni,
     descripcion  : body.descripcion ,
      disponible : body.disponible, 
       categoria : body.categoria,
        usuario  :   usuario._id
   });
    
      producto.save( (err, producto) =>{
          if (err) return res.status(500).json({ ok: false, err });
        
          if(producto) res.json({mensaje : 'Se guardo correctamente la producto', producto});
     });
   
});

router.put('/producto/:id' , [authorization] , (req, res)=>{
   let id =  req.params.id;
  let body =  req.body ; 
   body =   _.pick( body ,['nombre' ,  'precioUni' ,  'descripcion' , 'disponible', 'categoria']);
     editar( id,body, res);
});

router.delete("/producto/:id" , [ authorization] , (req, res)=>{
    let usuario =  req.usuario;
    let id =req.params.id; 
      if(usuario.role  ==  'admin'){
         /*si es admin se necesita mandar como parametro 
           si desea eliminar la categoria o desea eliminarla*/      
        let  rpta =  req.query.tipo;
         if(rpta  ==  'eliminar'){
           eliminar(id , res); 
         }else{
           if(rpta == 'editar'){
               editar(id,{ disponible : false} , res);
           }
         }   
     }else{
          editar(id,{ disponible  : false} , res);   
     }
  });

router.get('/producto/buscar/:termino', (req, res)=>{
  let desde = req.query.desde;
  let hasta = req.query.hasta;

  /*  ordenar = sort => sort('atributo por el cual desea ordenar')  */
  desde = Number(desde);
  hasta = Number(hasta);
   let termino =  req.params.termino;
  let regx = new RegExp(termino, 'i');
  Producto.find({ nombre : regx}) .sort('nombre').skip(desde).limit(hasta)
  /* populate tambien recibe como segundo argumento
   los atributos que estan permitido 
  .populate('usuario'. 'nombre email') */
   .populate('categoria' , 'nombre')
  .exec((err, docs) => {
    if (err) return res.status(500).json({ ok: false, err });
    if (!docs)
      return res
        .status(400)
        .json({ ok: false, err: "no existen categorias" });

    if (docs) res.status(200).json({ ok: true, docs });
  });

});

/*=============================================
                    metodos          
=============================================*/
/* eliminar */
let eliminar = (id, res)=>{
     Producto.findByIdAndDelete( id ,  (err,  producto)=>{
       if (err) return res.status(500).json({ ok: false, err });
       if(producto) res.json({mensaje : 'Se Elimino  correctamente la producto', producto});
    });
  }
  /* editar */
 let editar =  (id , body , res)=>{
     Producto.findByIdAndUpdate( id , body , { new  :  true},  ( err, producto)=>{
          if (err) return res.status(500).json({ ok: false, err });
          if(producto) res.json({mensaje : 'Se modifico correctamente la categoria', producto});
         });     
 }
/*=====  End of metodos   ======*/




module.exports = router;
