const express = require("express");

const app = express.Router();


app.use(require('./usuario'));
app.use(require('./login'));



module.exports = app;



