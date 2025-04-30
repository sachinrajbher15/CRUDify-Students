const pool = require("../db/db");

// Utility to send 404 if no rows
const handleNotFound = (rows, res, message) => {
  if (rows.length === 0) {
    res.status(404).json({ error: message });
    return null;
  }
  return rows[0];
};

// Format date to 'YYYY-MM-DD'
const formatDate = (date) => date?.toISOString().split("T")[0] || null;

// CREATE
exports.createStudent = async (req, res) => {
  const { first_name, last_name, email, dob } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO students (first_name, last_name, email, dob) VALUES ($1, $2, $3, $4) RETURNING *`,
      [first_name, last_name, email, dob]
    );
    const student = result.rows[0];
    student.dob = formatDate(student.dob);
    res.status(201).json(student);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Failed to create student." });
  }
};

// READ ALL (with Pagination)
exports.getAllStudents = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT *, COUNT(*) OVER () AS total_count FROM students ORDER BY id LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const formattedRows = result.rows.map((student) => ({
      ...student,
      dob: formatDate(student.dob),
    }));

    res.json({
      data: formattedRows,
      total: result.rows[0]?.total_count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Failed to fetch students." });
  }
};

// READ ONE (with marks)
exports.getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const studentResult = await pool.query(
      `SELECT * FROM students WHERE id = $1`,
      [id]
    );

    const studentData = handleNotFound(studentResult.rows, res, "Student not found");
    if (!studentData) return;

    const marksResult = await pool.query(
      `SELECT subject, score FROM marks WHERE student_id = $1`,
      [id]
    );

    studentData.dob = formatDate(studentData.dob);

    res.json({
      ...studentData,
      marks: marksResult.rows,
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Failed to fetch student." });
  }
};

// UPDATE
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, dob } = req.body;

  try {
    const result = await pool.query(
      `UPDATE students SET first_name=$1, last_name=$2, email=$3, dob=$4 WHERE id=$5 RETURNING *`,
      [first_name, last_name, email, dob, id]
    );

    const updatedStudent = handleNotFound(result.rows, res, "Student not found");
    if (!updatedStudent) return;

    updatedStudent.dob = formatDate(updatedStudent.dob);

    res.json(updatedStudent);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Failed to update student." });
  }
};

// DELETE
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM students WHERE id = $1 RETURNING *`,
      [id]
    );

    const deletedStudent = handleNotFound(result.rows, res, "Student not found");
    if (!deletedStudent) return;

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Failed to delete student." });
  }
};
