import express from "express";
import { listAllRentals, insertRental, returnRental, deleteRental } from "../controllers/rentalsController.js";
import newRentalSchemaValidation from "../middlewares/newRentalSchemaValidation.js"

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", listAllRentals);
rentalsRouter.post("/rentals", newRentalSchemaValidation, insertRental);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;