const Joi = require("joi");

const paginationSchema = Joi.object({
  offset: Joi.number().integer().optional().min(0).default(0).messages({
    "number.base": "Offset must be a number.",
    "number.min": "Offset cannot be less than 0.",
  }),
  limit: Joi.number().integer().optional().min(1).default(10).messages({
    "number.base": "Limit must be a number.",
    "number.min": "Limit must be at least 1.",
  }),
});

async function validatePagination(request, response, next) {
  const { query } = request;
  const { error } = paginationSchema.validate(query);
  if (error) {
    return response.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = {
  validatePagination,
};
