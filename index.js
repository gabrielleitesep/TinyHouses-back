import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import userRoute from "./routes/userRoute.js";
import productRegistrationRoutes from "./routes/productRegistrationRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db("Tiny_Houses");

} catch (err) {
    console.log(err);
};

export const usuariosCollection = db.collection("usuarios");
export const atividadeCollection = db.collection("atividade");
export const atividadeAdminCollection = db.collection("atividade-admin");
export const productsCollection = db.collection("products");
export const carrinhoCollection = db.collection("carrinho");

app.use(userRoute);
app.use(productRegistrationRoutes);
app.use(productsRoutes);
app.use(cartRoutes);

app.listen(process.env.PORT, () => console.log(`App rodando na porta ${process.env.PORT}`));