import express from "express";
import newCategorySchemaValidation from "../middlewares/newCategorySchemaValidation.js";
import { listCategories, createCategory } from "../controllers/categoriesController.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/categories", listCategories);
categoriesRouter.post("/categories", newCategorySchemaValidation, createCategory);

export default categoriesRouter;