const Ajv = require('ajv');

const ajv = new Ajv({
  useDefaults: 'shared',
  coerceTypes: true,
});

const validate = (data, schema) => {
  if (schema.json) {
    try {
      data[schema.json] = JSON.parse(data[schema.json]); // eslint-disable-line
    } catch (e) {
      throw new Error(`Not valid JSON in ${schema.json} field`);
    }
  }

  const validator = ajv.compile(schema);
  const valid = validator(data);

  if (!valid) {
    throw validator.errors;
  }

  return true;
};

module.exports = validate;
