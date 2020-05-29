const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let error = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    error.school = "School field is required";
  }
  if (Validator.isEmpty(data.degree)) {
    error.degree = "Degree field is required";
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    error.fieldofstudy = "fieldofstudy field is required";
  }
  if (Validator.isEmpty(data.from)) {
    error.from = "From field is required";
  }

  return {
    error,
    isValid: isEmpty(error),
  };
};
