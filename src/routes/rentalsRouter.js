import express from "express";
import { listAllRentals, insertRental, returnRental, deleteRental } from "../controllers/rentalsController.js";

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", listAllRentals);
rentalsRouter.post("/rentals", insertRental);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;