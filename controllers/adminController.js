import { adminCollection, adminActiveCollection } from "../index.js";
import joi from "joi"
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

//to create an admin, insert "type: admin" in the object (see "userController.js") 
const loginJOI = joi.object({
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(1),
})

export async function loginAdmin(req, res) {

    const { email, password } = req.body;
    const token = uuidV4();
    const validacao = loginJOI.validate({ email, password }, { abortEarly: false })

    if (validacao.error) {
        const erros = validacao.error.details.map((d) => d.message)
        res.status(422).send(erros)
        return
    };

    try {
        const existente = await adminCollection.findOne({ email });

        if (!existente) {
            return res.sendStatus(401);
        }

        const encriptada = bcrypt.compareSync(password, existente.password);
        if (!encriptada) {
            return res.sendStatus(401);
        }

        await adminActiveCollection.insertOne({ token, userId: existente._id });

        res.send({ token });

    } catch (err) {
        res.sendStatus(500);
        console.log(err)
    }
};

export async function logoutAdmin(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const openedSession = await adminActiveCollection.findOne({ token });

        if (!openedSession) {
            return res.sendStatus(401);
        };

        await adminActiveCollection.deleteOne({ token });

        res.sendStatus(200);

    } catch (err) {
        res.sendStatus(500);
    };
};



