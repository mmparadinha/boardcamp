import express from "express";
import { listAllRentals, insertRental, returnRental, deleteRental, getRevenue } from "../controllers/rentalsController.js";
import newRentalSchemaValidation from "../middlewares/newRentalSchemaValidation.js"

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", listAllRentals);
rentalsRouter.post("/rentals", newRentalSchemaValidation, insertRental);
rentalsRouter.post("/rentals/:id/return", returnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);
rentalsRouter.get("/rentals/metrics", getRevenue);

export default rentalsRouter;