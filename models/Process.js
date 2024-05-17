const mongoose = require("mongoose");

const processSchema = new mongoose.Schema({
  pid: { type: Number, required: true, unique: true },
  creationTime: { type: Date, default: Date.now },
  logs: [{ type: String }],
});

const Process = mongoose.model("Process", processSchema);

module.exports = Process;
