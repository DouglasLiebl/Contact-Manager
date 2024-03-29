const e = require("connect-flash");
const Contact = require("../models/contactModel");

exports.index = (req, res) => {
    res.render("contact", {contact: {}});
}

exports.register = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.register();

        if (contact.errors.length > 0) {
            req.flash("errors", contact.errors);
            req.session.save(function() {
                return res.redirect("index");
            });
            return;
        };

        req.flash("success", "Contato registrado com sucessso.");
        req.session.save(function() {
            return res.redirect(`/contact/index/${contact.contact._id}`);
        });
    } catch (error) {
        console.log(error);
        res.render("404");
    }
}

exports.editIndex = async (req, res) => {
    if (!req.params.id) return res.render("404");
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.render("404"); 

    res.render("contact", {contact})
}

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render("404");
        const contact = new Contact(req.body);
        await contact.edit(req.params.id);

        if (contact.errors.length > 0) {
            req.flash("errors", contact.errors);
            req.session.save(function() {
                return res.redirect("index");
            });
            return;
        };

        req.flash("success", "Contato editado com sucessso.");
        req.session.save(function() {
            return res.redirect(`/contact/index/${contact.contact._id}`);
        });
    } catch (error) {
        console.log(error);
        res.render("404");
    }
     
}


exports.delete = async (req, res) => {
    try {
        if (!req.params.id) return res.render("404");
        
        const contact = Contact.delete(req.params.id);
        if (!contact) return res.render("404")
        
        req.flash("success", "Contato deletado com sucesso.");
        req.session.save(function() {
            return res.redirect("back");
        });
    } catch (error) {
        console.log(error);
        res.render("404");
    }
}