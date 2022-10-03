import express from "express";
import { listGames, createGame } from "../controllers/gamesController.js";
import newGameSchemaValidation from "../middlewares/newGameSchemaValidation.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", listGames);
gamesRouter.post("/games", newGameSchemaValidation, createGame);

export default gamesRouter;