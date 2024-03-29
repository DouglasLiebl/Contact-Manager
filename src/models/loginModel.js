const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
    email: {type: String, require: true},
    password: {type: String, require: true}
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.validate();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({email: this.body.email});

        if(!this.user) {
            this.errors.push("Usuário ou senha inválidos.");
            return;
        };

        if (!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push("Senha inválida.");
            this.user = null;
            return;
        };
    }

    async register() {
        this.validate();
        if (this.errors.length > 0) return;
        
        await this.userCheck();
        if (this.errors.length > 0) return;

        this.encode_password();

        this.user = await LoginModel.create(this.body);
    }

    encode_password() {
        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);
    }

    async userCheck() {
        const response = await LoginModel.findOne({email: this.body.email});

        if (response) this.errors.push("Usuário já registrado.");
    }

    validate() {
        this.cleanUp();

        if (!validator.isEmail(this.body.email)) this.errors.push("Email inválido.");

        if (this.body.password.length < 8 || this.body.password.length > 50) this.errors.push("A senha precisa ter entre 8 e 50 caracteres.");
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== "string") this.body[key] = "";
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;
