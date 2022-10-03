import gameSchema from "../schemas/gameSchema.js";


const newGameSchemaValidation = async (req, res, next) => {
  const game = req.body;
  const validation = gameSchema.validate(game);

  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  next();
};

export default newGameSchemaValidation;