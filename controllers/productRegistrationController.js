import { atividadeCollection, productsCollection } from "../index.js";
import joi from "joi";

const productSchema = joi.object({
    title: joi.string().required(),
    image: joi.string().required(),
    description: joi.string().required(),
    maker: joi.string().required(),
    guarantee: joi.string().required(),
    area: joi.string().required(),
    price: joi.string().required(),
});

export async function productRegistration(req, res) {

    const { title, image, description, maker, guarantee, area, price } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    };  

    try {
        const session = await atividadeCollection.findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        };
    
        const validation = productSchema.validate({ title, image, description, maker, guarantee, area, price }, { abortEarly: false });
    
        if (validation.error) {
            const err = validation.error.details.map((d) => d.message);
            return res.status(422).send(err);
        };

        await productsCollection.insertOne({ title, image, description, maker, guarantee, area, price });
        
        res.sendStatus(201);

    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    };
};