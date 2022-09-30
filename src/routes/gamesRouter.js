import express from "express";
import { listGames, createGame } from "../controllers/gamesController.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", listGames);
gamesRouter.post("/games", createGame);

export default gamesRouter;