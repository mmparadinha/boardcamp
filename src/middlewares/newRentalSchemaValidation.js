import rentalSchema from "../schemas/rentalSchema.js";


const newRentalSchemaValidation = async (req, res, next) => {
  const rental = req.body;
  const validation = rentalSchema.validate(rental);

  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  next();
};

export default newRentalSchemaValidation;