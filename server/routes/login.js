const express = require("express");

const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const router = express.Router();
const  jwt = require('jsonwebtoken');
//=============================//
//       method post          //
//===========================//
router.post("/login", (req, res) => {
  let body = req.body;

  /*  findOner: busca un solo elemento de la base de datos  */
  Usuario.findOne({ email: body.email }, (err, usuarioBd) => {
     //si se genera algu error
     if (err) {
      return res.status(500).json({ ok: false, err });
    }
  //si no se encuentra el usuario en la base de datos
    if (!usuarioBd) {
      return res
        .status(400)
        .json({ ok: false, err: "usuario o contraseña ivalidos" });
    }
 //si las contraseñas no hacen match
    if (!bcrypt.compareSync(body.password, usuarioBd.password)) {
      return res
        .status(400)
        .json({ ok: false, err: "usuario o contraseña ivalidos" });
    }
  //si se encontro y se logo loguear
let token =  jwt.sign({ data : usuarioBd}, process.env.SEED, {expiresIn :process.env.CADUCIDADTOKEN});
    res.status(400).json({ ok: true,usuarioBd, token });
  });
});




module.exports = router;





