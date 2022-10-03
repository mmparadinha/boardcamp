import categorySchema from "../schemas/categorySchema.js";


const newCategorySchemaValidation = async (req, res, next) => {
  const category = req.body;
  const validation = categorySchema.validate(category);

  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  next();
};

export default newCategorySchemaValidation;