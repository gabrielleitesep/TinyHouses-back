import { usuariosCollection, atividadeCollection, atividadeAdminCollection } from "../index.js";
import joi from "joi"
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

const cadastroJOI = joi.object({
    name: joi.string().required().min(2).max(50),
    email: joi.string().email().required().min(6).max(50),
    cpf: joi.number().required(),
    address: joi.string().required().min(20).max(100),
    password: joi.string().required().min(4).max(8),
});

const loginJOI = joi.object({
    email: joi.string().email().required().min(6).max(50),
    password: joi.string().required().min(4).max(8),
});

//to create an admin user, use "type: admin" (line 38)
export async function cadastro(req, res) {

    const { name, email, cpf, address, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 3);
    const validacao = cadastroJOI.validate({ name, email, cpf, address, password }, { abortEarly: false })

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    };

    try {
        const emailExistente = await usuariosCollection.findOne({ email });
        if (emailExistente) {
            return res.status(409).send("E-mail já cadastrado");
        };

        await usuariosCollection.insertOne({ name, email, cpf, address, password: hashPassword, type: "user" });
        res.sendStatus(201);

    } catch (err) {
        return res.sendStatus(500);
    };
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
        };

        const userType = existente.type;

        if (userType === "admin") {
            await atividadeAdminCollection.insertOne({ token, userId: existente._id });
        };

        const encriptada = bcrypt.compareSync(password, existente.password);
        if (!encriptada) {
            return res.sendStatus(401);
        };

        const sessaoAberta = await atividadeCollection.findOne({ userId: existente._id });

        if (sessaoAberta) {
            await atividadeCollection.deleteOne({ userId: existente._id });
        };

        await atividadeCollection.insertOne({ token, userId: existente._id });

        res.status(200).send({ token, userType });

    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    };
};

export async function logout(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    };

    try {
        const openedSession = await atividadeCollection.findOne({ token });

        if (!openedSession) {
            return res.sendStatus(401);
        };

        await atividadeCollection.deleteOne({ token });

        res.sendStatus(200);

    } catch (err) {
        res.sendStatus(500);
    };
};


