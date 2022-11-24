import { usuariosCollection, atividadeCollection, adminCollection } from "../index.js";
import joi from "joi"
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

const cadastroJOI = joi.object({
    name: joi.string().required().min(1),
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
});

const loginJOI = joi.object({
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
});

export async function cadastro(req, res) {

    const { name, email, password, type } = req.body;
    const hashPassword = bcrypt.hashSync(password, 3);
    const validacao = cadastroJOI.validate({ name, email, password }, { abortEarly: false })

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    };

    if (type === "admin") {
        try {
            await adminCollection.insertOne({ name, email, password: hashPassword, type });
            res.sendStatus(201);
        } catch (err) {
            res.sendStatus(500);
        }
        return
    };

    try {
        await usuariosCollection.insertOne({ name, email, password: hashPassword });
        res.sendStatus(201);

    } catch (err) {
        return res.sendStatus(500);
    }
};

export async function login(req, res) {

    const { email, password } = req.body;
    const token = uuidV4();
    const validacao = loginJOI.validate({ email, password }, { abortEarly: false })

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    };

    try {
        const existente = await usuariosCollection.findOne({ email });        
        if (!existente) {
            return res.sendStatus(401);
        }

        const encriptada = bcrypt.compareSync(password, existente.password);
        if (!encriptada) {
            return res.sendStatus(401);
        }

        await atividadeCollection.insertOne({ token, userId: existente._id });

        res.send({ token });

    } catch (err) {
        res.sendStatus(500);
        console.log(err)
    }
};


