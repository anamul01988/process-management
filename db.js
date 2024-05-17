const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://anamulhaque01827:mduOd83KpmYLuTIO@cluster0.ajkrnq2.mongodb.net/process-management?retryWrites=true&w=majority"
    );

    if (connection) {
      console.log("Connection established");
    }
  } catch (error) {
    console.log("Error in connectToDatabase", error);
    throw error;
  }
};
module.exports = connectToDatabase;
