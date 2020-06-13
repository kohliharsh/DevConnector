const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let error = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 2, max: 1500 })) {
    error.text = "text must be between 2 to 1500 characters";
  }

  if (Validator.isEmpty(data.text)) {
    error.text = "Text field is required";
  }

  return {
    error,
    isValid: isEmpty(error),
  };
};
