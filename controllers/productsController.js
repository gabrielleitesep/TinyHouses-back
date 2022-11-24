import { productsCollection } from "../index.js";

export async function getProducts(req, res) {

    try {
        const products = await productsCollection.find().toArray();
        res.status(201).send(products);

    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    };
};