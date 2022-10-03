import Joi from "joi";

const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.required(),
  stockTotal: Joi.number().integer().required(),
  categoryId: Joi.number().integer().required(),
  pricePerDay: Joi.number().integer().required()
});

export default gameSchema;