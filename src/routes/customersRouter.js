import express from "express";
import { listAllCustomers, listSingleCustomer, insertCustomer, updateCustomer } from "../controllers/customersController.js";
import newCustomerSchemaValidation from "../middlewares/newCustomerSchemaValidation.js";

const customersRouter = express.Router();

customersRouter.get("/customers", listAllCustomers);
customersRouter.get("/customers/:id", listSingleCustomer);
customersRouter.post("/customers", newCustomerSchemaValidation, insertCustomer);
customersRouter.put("/customers/:id", newCustomerSchemaValidation, updateCustomer);

export default customersRouter;