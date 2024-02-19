const Contact = require("../models/contactModel");

exports.index = async (req, res) => {
  const contacts = await Contact.findAll();
  res.render('index', {contacts});
};
