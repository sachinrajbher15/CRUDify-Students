const express = require('express');
const router = express.Router();
const {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');

router.post('/', createStudent); // Create a new student
router.get('/', getAllStudents); // Get all students
router.get('/:id', getStudentById); // Get a student by ID
router.put('/:id', updateStudent); // Update a student by ID
router.delete('/:id', deleteStudent); // Delete a student by ID

module.exports = router;