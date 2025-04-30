import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const StudentForm = ({ selectedStudent, onSave }) => {
  const [student, setStudent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
  });

  useEffect(() => {
    if (selectedStudent) {
      setStudent(selectedStudent);
    } else {
      setStudent({ first_name: '', last_name: '', email: '', dob: '' });
    }
  }, [selectedStudent]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = student.id ? 'PUT' : 'POST';
    const url = student.id
      ? `http://localhost:5000/students/${student.id}`
      : 'http://localhost:5000/students';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      Swal.fire('Success', `Student ${student.id ? 'updated' : 'created'} successfully`, 'success');
      onSave();
      setStudent({ first_name: '', last_name: '', email: '', dob: '' });
    } catch (error) {
      Swal.fire('Error', 'There was an error processing your request', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-form-container">
      <h4>{student.id ? 'Edit Student' : 'Add Student'}</h4>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="first_name"
            value={student.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="last_name"
            value={student.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={student.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="dob"
            value={student.dob}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        {student.id ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default StudentForm;