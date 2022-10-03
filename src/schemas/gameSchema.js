import Joi from "joi";

const gameSchema = Joi.object({
  stockTotal: Joi.number().integer().required(),
  categoryId: Joi.number().integer().required(),
  pricePerDay: Joi.number().integer().required()
});

export default gameSchema;