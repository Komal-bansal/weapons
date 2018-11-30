const _ = require("lodash");

exports.pickUserProfileResponse = data => {
  let response = _.pick(data, ["_id", "name", "email", "phone", "role", "publicKey"]);
  return response;
};
exports.pickRegistrationData = data => {
  var response = _.pick(data, ["name", "email", "phone", "password", "role", "publicKey"]);
  return response;
};
exports.pickRegistrationResponse = data => {
  var response = _.pick(data, ["_id", "name", "email", "phone", "token", "role", "publicKey"]);
  return response;
};

exports.pickUserCredentials = data => {
  return _.pick(data, ["email", "password"]);
};

