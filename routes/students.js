// @ts-check
const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// getting all
router.get("/", async (req, res) => {
  try {
    // get all the students from the model
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message }); // 500 means error on server (here database) , any error in 500 means that
  }
});

// middleware
// this will take in id and give back a student
async function getStudent(req, res, next) {
  let student;
  try {
    student = await Student.findById(req.params.id);
    if (student == null) {
      return res.status(404).json({ message: "cannot find student" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.student = student; // Add the student to the response object for use in next middleware/route handler
  next(); // Pass control to the next middleware/route handler
}

// getting one
// params.id would give back any
router.get("/:id", getStudent, (req, res) => {
  res.json(res.student);
});

// creating one
router.post("/", async (req, res) => {
  const student = new Student({
    name: req.body.name,
    courses: req.body.courses,
    dateJoined: req.body.dateJoined,
  });
  // save our student deets
  try {
    const newStudent = await student.save();
    // send to user using json
    // 201 - successfully created an object
    res.status(201).json(newStudent);
    console.log(req.body);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// updating one
router.patch("/:id", getStudent, async (req, res) => {
  console.log(req.body);
  const updateFields = { ...req.body };

  try {
    // Update the existing student with the new fields
    Object.assign(res.student, updateFields);

    // Save the updated student
    const updatedStudent = await res.student.save();

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error while updating: " + error.message });
  }
});

// deleting one
router.delete("/:id", async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "cannot find student" });
    }
    res.json({ message: "deleted student" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
