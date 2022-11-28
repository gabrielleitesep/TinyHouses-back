import { atividadeCollection, carrinhoCollection } from "../index.js";

export async function listarCarrinho(req, res) {

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

        const cartProducts = await carrinhoCollection.find().toArray();
        res.status(201).send(cartProducts);

    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    };
};

export async function inserirCarrinho(req, res) {

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

        await carrinhoCollection.insertOne({ title, image, price }).toArray();

        res.sendStatus(201);

    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    };
};

export async function deletarCarrinho(req, res) {
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

        await carrinhoCollection.deleteOne([{ title, image, price }]);

        res.sendStatus(201);

    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    };
}