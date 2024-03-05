const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  courses: {
    type: String,
    required: true,
  },
  dateJoined: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// model takes two params - name of model in our database, schema that correspond to model
// model allows you to directly interact with the database when this is exported
module.exports = mongoose.model("Student", studentSchema);
