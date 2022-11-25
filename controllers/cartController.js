import { carrinhoCollection } from "../index.js";

export async function carrinho(req, res) {

    try {
        const carrinho = await carrinhoCollection.find().toArray();
        res.status(201).send(carrinho);

    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    };
};