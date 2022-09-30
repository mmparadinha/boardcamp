import express from "express";
import { listCategories, createCategory } from "../controllers/categoriesController.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/categories", listCategories);
categoriesRouter.post("/categories", createCategory);

export default categoriesRouter;