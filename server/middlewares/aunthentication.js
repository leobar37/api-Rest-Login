
/* se requiere jsonwebtoken para verificar el token enviado desde el frontend */
const jwt = require("jsonwebtoken");
/*=============================================
=            middeleware usuario autorizacion            =
=============================================*/
let authorization = (req, res, next) => {
  /* de esta manera se puede obtener informacion desde los header */
  let token = req.get("token");
  jwt.verify(token, process.env.SEED, (err, code) => {
     
     /* si la verifcacion genero algun error o el codigo obtenido es ivalido */ 
    if (err || !code) {return res.status(401).json({ ok: false, err :{ message : 'token no valido'} });}  
    req.usuario = code.data;
    next();
  }); 
};
/*=====  End of middeleware usuario autorizacion  ======*/

  /*=============================================
 =            seccion de comprobar usario            =
 =============================================*/
 let verificaRol = (req, res, next) => {
   let usuarioReq = req.usuario;
   if (usuarioReq.role === "admin") {
     /* si el usuario es admin la operacion puede seguir */
     next();
   } else {
     return res.json({  message: "solo los admins pueden editar "}); }
 };
 /*=====  End of seccion de comprobar usario  ======*/
module.exports = {
  authorization,
  verificaRol
};

