import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const StudentList = ({ onEdit }) => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0 });

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/students?page=${pagination.page}&limit=${pagination.limit}`
      );
      const data = await response.json();
      setStudents(data.data);
      setPagination({ ...pagination, total: data.total });
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch students', 'error');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [pagination.page]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/students/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Network response was not ok');

        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
        fetchStudents();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete student', 'error');
      }
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div>
      <h4>Student List</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu) => (
            <tr key={stu.id}>
              <td>{stu.first_name}</td>
              <td>{stu.last_name}</td>
              <td>{stu.email}</td>
              <td>{stu.dob}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(stu)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(stu.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, idx) => (
            <li
              key={idx + 1}
              className={`page-item ${pagination.page === idx + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setPagination({ ...pagination, page: idx + 1 })}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${pagination.page === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StudentList;