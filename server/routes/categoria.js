
const express = require('express');
const router =  express.Router();
const mongoose  = require('mongoose');
const {authorization}  = require('../middlewares/aunthentication');
const Categoria =  require('../models/categoria');
const _ = require('underscore');
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
router.get("/categoria", [authorization], (req, res) => {
  let desde = req.query.desde;
  let hasta = req.query.hasta;

  /*  ordenar = sort => sort('atributo por el cual desea ordenar')  */
  desde = Number(desde);
  hasta = Number(hasta);
  Categoria.find({})
    .sort('nombre')
    .skip(desde)
    .limit(hasta)
     .populate('usuario')
    .exec((err, docs) => {
      if (err) return res.status(500).json({ ok: false, err });
      if (!docs)
        return res
          .status(400)
          .json({ ok: false, err: "no existen categorias" });

      if (docs) res.status(200).json({ ok: true, docs });
    });
});


router.get("/categoria/:id", [authorization], (req, res) => {
 
    let id  =  req.params.id;
      
     Categoria.findById( id ,(err, categoria)=>{
          if (err) return res.status(500).json({ ok: false, err });
          if (!categoria)
            return res
              .status(400)
              .json({ ok: false, err: "no existen esta categoria"});
            
       if(categoria) res.status(200).json({  ok :  true,  categoria });

     } );


});

router.post('/categoria' , [authorization], (req, res)=>{
 
   let body =   req.body;
   let usuario  =  req.usuario;
    
     let categoria =  new Categoria({
         nombre  :  req.body.nombre,
         usuario  : usuario._id
     });
    
     categoria.save( (err, categoria) =>{
          if (err) return res.status(500).json({ ok: false, err });
        
          if(categoria) res.json({mensaje : 'Se guardo correctamente la categorira', categoria});
     });
   
});

router.put( '/categoria/:id' , [authorization] , (req, res)=>{
   let id =  req.params.id;
  let body =  req.body ; 

   body =   _.pick( body ,['nombre']);
     editar( id,body, res);
});

router.delete("/categoria/:id" , [ authorization] , (req, res)=>{
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
               editar(id,{ estado  : false} , res);
           }
         }   
     }else{
          editar(id,{ estado  : false} , res);   
     }
  });
  

/*=============================================
=            metodos             =
=============================================*/
/* eliminar */
let eliminar = (id, res)=>{
     Categoria.findByIdAndDelete( id ,  (err,  categoria)=>{
       if (err) return res.status(500).json({ ok: false, err });
       if(categoria) res.json({mensaje : 'Se Elimino  correctamente la categoria', categoria});
    });
  }
  /* editar */
 let editar =  (id , body , res)=>{
     Categoria.findByIdAndUpdate( id , body , { new  :  true},  ( err, categoria)=>{
          if (err) return res.status(500).json({ ok: false, err });
          if(categoria) res.json({mensaje : 'Se modifico correctamente la categoria', categoria});
         });     
 }
/*=====  End of metodos   ======*/




module.exports = router;
