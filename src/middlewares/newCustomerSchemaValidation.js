import customerSchema from "../schemas/customerSchema.js";


const newCustomerSchemaValidation = async (req, res, next) => {
  const customer = req.body;
  const validation = customerSchema.validate(customer);

  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  next();
};

export default newCustomerSchemaValidation;