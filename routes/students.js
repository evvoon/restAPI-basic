// @ts-check
const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// need routes for getting all , updating , del , creating one

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
// patch is used instead of put cuz maybe u wanna only update one field not all
router.patch("/:id", getStudent, (req, res) => {});

// deleting one
router.delete("/:id", getStudent, async (req, res) => {
  try {
    await res.student.remove();
    res.json({ message: "deleted student" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
