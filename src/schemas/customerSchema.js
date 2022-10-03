import Joi from "joi";

const customerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required().pattern(/^[0-9]+$/).min(10).max(11),
  cpf: Joi.string().required().pattern(/^[0-9]+$/).length(11),
  birthday: Joi.date().required(),
});

export default customerSchema;