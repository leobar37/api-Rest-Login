const express = require("express");

const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const router = express.Router();
const  jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

/*ruta para la documentacion
  https://developers.google.com/identity/sign-in/web/backend-auth
 */
/*=============================================
=            ruta para la autenticacion de un usuario            =
=============================================*/
router.post("/login", (req, res) => {
  let body = req.body;
  /*  findOne: busca un solo elemento de la base de datos  */
  Usuario.findOne({ email: body.email }, (err, usuarioBd) => {
    //error de la base de datos incluye error de conexion 
    if (err) { return res.status(500).json({ ok: false, err });  }
    //usuario no encontrado
    if (!usuarioBd) return res.status(400).json({ ok: false, err: "usuario o contraseña ivalidos" });
    //si las contraseñas no hacen match 
    if (!bcrypt.compareSync(body.password, usuarioBd.password)) {return res.status(400).json({ ok: false, err: "usuario o contraseña ivalidos" });}

    /* generacion del token */
    let token = jwt.sign({ data : usuarioBd},process.env.SEED ,{expiresIn : process.env.CADUCIDADTOKEN})
    
    /* resultado */
    res.status(400).json({ ok: true, usuarioBd, token });
  });
});
/*=====  End of ruta para la autenticacion de un usuario  ======*/
/* metodo verify */
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();
   let  user = {
      nombre :  payload.name,
      email  : payload.email,
      img : payload.picture,
      google : true
   }
   
   return user;
}
/*=============================================
=            autenticacion via google            =
=============================================*/
router.post( '/google', async (req, res)=>{
 let token  = req.body.idtoken;
 let usuario = await verify(token).catch(e=>{
    res.json({error : e})
 });  
 /**algoritmo
  *  verificar si existe  este usuario => darle un token personalizado en mi app
  *  si existe pero no esta registrado con google => mandar mensaje de uso de sus creedenciales
  */
Usuario.findOne({ email : usuario.email },(err , usuarioBd)=>{
  if(err)return res.status(500).json(err);  
  
  if(usuarioBd){
     
     if(!usuarioBd.google) return res.status(400).json({error : 'necesita autenticarse con sus credenciales normales'})
     else{
        //establecer un token personalizado 
        let token =  jwt.sign({data : usuarioBd} , process.env.SEED , { expiresIn :  process.env.CADUCIDADTOKEN})
        return res.json({usuario :  usuarioBd,token})
      } 
  }else{
     //si no existe en la base de datos 
       let usuarioB  = new Usuario();
      usuarioB.nombre =  usuario.nombre;
      usuarioB.email =  usuario.email;
      usuarioB.img = usuario.img;
      usuarioB.password =  ':)';
      usuarioB.save( (err, us)=>{
        if(err){
          console.log('ERRO AQUI');
          res.status(500).json()}
        if(us){
          let token = jwt.sign( {data : us}, process.env.SEED , {expiresIn : process.env.CADUCIDADTOKEN});
         return res.json({ usuario : us , token , men: 'se creo en la base de datos'});
        }
      })
  }
});
});

/*=====  End of autenticacion via google  ======*/





module.exports = router;





