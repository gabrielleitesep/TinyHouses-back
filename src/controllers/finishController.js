import { vendasCollection, atividadeCollection} from "../index.js";

export async function finalizar(req, res) {

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

        await vendasCollection.insertOne({ user, price, title }).toArray();

        res.sendStatus(201);

    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    };
};