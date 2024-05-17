const express = require("express");
const mongoose = require("mongoose");
const Process = require("./models/Process");
const { format } = require("date-fns");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/process-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const formatDate = (date) => {
  return format(date, "hh.mm a dd.MM.yyyy");
};

// Endpoint to create a new process
app.post("/create-process", async (req, res) => {
  try {
    const newProcess = new Process({
      pid: Math.floor(Math.random() * 1000), // Generate a random PID
    });
    await newProcess.save();
    res.status(201).json({
      PID: newProcess.pid,
      "Creation time": formatDate(newProcess.creationTime),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to get logs for a single process by PID
app.get("/get-single/:pid", async (req, res) => {
  try {
    const process = await Process.findOne({ pid: req.params.pid });
    if (!process) {
      return res.status(404).json({ message: "Process not found" });
    }
    res.json({
      PID: process.pid,
      "Creation time": formatDate(process.creationTime),
      logs: process.logs, //only logs will remaian
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Function to log messages to a process every 5 seconds
const logProcess = async () => {
  setInterval(async () => {
    const processes = await Process.find();
    processes.forEach(async (process) => {
      const formattedLogEntry = `${formatDate(new Date())}`;
      process.logs.push(formattedLogEntry);
      await process.save();
    });
  }, 5000);
};

logProcess();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
