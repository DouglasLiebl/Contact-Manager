const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require("./src/controllers/loginController");
const contactController = require("./src/controllers/contactController");

const { loginRequired } = require("./src/middlewares/middleware");

// Rotas da home
route.get('/', homeController.index);

route.get("/login/index", loginController.index);
route.post("/login/register", loginController.register);
route.post("/login/login", loginController.login);
route.get("/login/logout", loginController.logout);

route.get("/contact/index", loginRequired, contactController.index);
route.post("/contact/register", contactController.register);
route.get("/contact/index/:id", contactController.editIndex);
route.post("/contact/edit/:id", contactController.edit);
route.get("/contact/delete/:id", contactController.delete);

module.exports = route;
