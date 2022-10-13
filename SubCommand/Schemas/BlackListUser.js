const { model, Schema } = require("mongoose");

module.exports = model(
  "blacklist-user",
  new Schema({
    User: String,
    Reason: String,
    Time: Number
  })
);
