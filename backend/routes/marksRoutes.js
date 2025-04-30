const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Create a new mark
router.post('/', async (req, res) => {
  const { student_id, subject, score } = req.body;

  if (!student_id || !subject || score === undefined) {
    return res.status(400).json({ error: 'student_id, subject, and score are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO marks (student_id, subject, score) VALUES ($1, $2, $3) RETURNING *',
      [student_id, subject, score]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting mark:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;