const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let topicSchema = new Schema({
  topic: { type: String },
  notes: [
    {
      name: { type: String },
      text: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Topic", topicSchema);
