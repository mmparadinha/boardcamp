import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js';
import customersRouter from './routes/customersRouter.js';
import rentalsRouter from './routes/rentalsRouter.js';

dotenv.config()

const server = express();
server.use(express.json());
server.use(cors());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);
server.use(rentalsRouter);

server.listen(process.env.BACKEND_PORT, () => {
    console.log(`Server is listening on port ${process.env.BACKEND_PORT}.`);
});