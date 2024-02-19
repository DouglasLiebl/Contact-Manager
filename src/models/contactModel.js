const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = new mongoose.Schema({
    name: {type: String, require: true},
    surname: {type: String, require: false, default: ""},
    email: {type: String, require: false, default: ""},
    phoneNumber: {type: String, require: false, default: ""},
    createdAt: {type: Date, default: Date.now}
});

const ContactModel = mongoose.model("Contact", ContactSchema);

class Contact {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contact = null;
    };

    async register() {
        this.validate();

        if (this.errors.length > 0) return;
        this.contact = await ContactModel.create(this.body);
    };

    validate() {
        this.cleanUp();

        if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push("Email inválido.");
        console.log(this.body.email, this.body.phoneNumber);
        if (!this.body.name) this.errors.push("Nome é um campo obrigatório.");
        if (!this.body.email && !this.body.phoneNumber) {
            this.errors.push("Pelo menos um precisa ser enviado: email ou telefone.");
        }

    };

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== "string") this.body[key] = "";
        }

        this.body = {
            name: this.body.name,
            surname: this.body.surname,
            email: this.body.email,
            phoneNumber: this.body.phoneNumber
        };
    };

    static async findById(id) {
        if (typeof id !== 'string') return;

        return await ContactModel.findById(id);
    };

    async edit(id) {
        if (typeof id !== 'string') return;
        this.validate();
        if (this.errors.length > 0) return;

        this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {new: true});
    }

    static async findAll() {
        return await ContactModel.find().sort({createdAt: -1});
    }

    static async delete(id) {
        if (typeof id !== 'string') return;
        return await ContactModel.findByIdAndDelete({_id: id});
    }
}

module.exports = Contact;
