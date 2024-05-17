const express = require("express");
const Process = require("./models/Process");
const formatDate = require("./utils");
const connectToDatabase = require("./db");

const app = express();
app.use(express.json());

connectToDatabase();

// Endpoint to create a new process
app.post("/create-process", async (req, res) => {
  try {
    const newProcess = new Process({
      pid: Math.floor(Math.random() * 1000),
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

// Endpoint to get all processes
app.get("/get-all", async (req, res) => {
  try {
    const processes = await Process.find();
    const formattedProcesses = processes.map((process) => ({
      PID: process.pid,
      "Creation time": formatDate(process.creationTime),
      //   logs: process.logs,
    }));
    res.json(formattedProcesses);
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
      //   PID: process.pid,
      //   "Creation time": formatDate(process.creationTime),
      logs: process.logs, //only logs will remaian
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to delete a process by PID
app.delete("/delete-process/:pid", async (req, res) => {
  try {
    const result = await Process.findOneAndDelete({ pid: req.params.pid });
    if (!result) {
      return res.status(404).json({ message: "Process not found" });
    }
    res.json({
      message: `${req.params.pid} The process has been successfully deleted.`,
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
