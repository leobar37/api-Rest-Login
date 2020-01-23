const express = require("express");
const _ = require("underscore");
const Usuario = require("../models/usuario");
const { authorization ,verificaRol } = require("../middlewares/aunthentication");
const bcrypt = require("bcrypt");
const router = new express.Router();
//=============================//
//       CRUD DE un usuario   //
//===========================//

//=============================//
//       method post          //
//===========================//
router.post("/usuario", [authorization,verificaRol], (req, res) => {
  let body = req.body;
  if (body.nombre == undefined) {
    res.status(404).send("error");
  } else {
    let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      role: body.role,
      google: body.google,
      estado: body.estado
    });
    usuario.save((err, usuarioDb) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        usuario: usuarioDb
      });
    });
  }
});
//=============================//
//       method put           //
//===========================//
router.put("/usuario/:id", [authorization,verificaRol], (req, res) => {

  let id = req.params.id;
  //de esta manera se limitan los valor a editar desde el frontend
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDb) => {
    if (err || !usuarioDb) {
      return res.status(400).json({
        respuesta: "error de callback",
        err
      });
    }

    res.status(200).json({
      usuarioDb
    });
  });
});
//=============================//
//       method  get          //
//===========================//
router.get("/usuario", authorization, (req, res) => {
  /*paginacion
metoodo skip(omitir) = = reciber como parametro los la cantidad de registro que se tiene que omitir
limit   = recibe como parametro la cantidad de registros que se deben mostrar 
 parametros opcionarles = se recepcionan del req a travez de de query =>  req.query.parametro   
para enviarlos ?parametro=dato
 
metodo find=  recibe 2 parametros (condiccion, campos que se quiera  mostrar:String) 
Ejemplo: 
 Usuario.find({} , 'email nombre') = en este caso todos los objetos 
 se mostraran  con solo email y nombre 
 
*/
  let desde = req.query.desde;
  let limite = req.query.limite;
  limite = Number(limite);
  desde = Number(desde);
  Usuario.find({})
    .skip(desde)
    .limit(limite)
    .exec((err, personas) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      Usuario.countDocuments({}, (err, cont) => {
        res.json({
          ok: true,
          personas,
          cont
        });
      });
    });
});
//=============================//
//       method  delete        //
//===========================//
/*Usualmente ya no se eliminan registros 
de la base de datos solo e cambian de estado 
a excepciones que si se requiera 
*/
router.delete("/usuario/:id", [authorization,verificaRol], (req, res) => {

  let id = req.params.id;
  Usuario.findByIdAndDelete(id, (err, usBorrado) => {
    if (err || !usBorrado) {
      return res
        .status(400)
        .json({ ok: false, error: { message: "usuario no encontrado" }, err });
    }
    res.status(200).json({ usBorrado });
  });
});
//=============================//
//       method  update user   //
//===========================//
router.delete("/usuario/baja/:id", [authorization ,verificaRol], (req, res) => {

  let id = req.params.id;
  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true },
    (err, usuarioUpdate) => {
      if (err) {
        return res.status(400).json({
          err
        });
      }
      res.json({
        usuarioUpdate
      });
    }
  );
});

module.exports = router;
