import './App.css'
import React, { useState } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

const App = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (student) => {
    setSelectedStudent(student);
  };

  const handleSave = () => {
    setSelectedStudent(null);
    setRefresh(!refresh);
  };

  return (
    <div className="container mt-5">
      <StudentForm selectedStudent={selectedStudent} onSave={handleSave} />
      <StudentList onEdit={handleEdit} key={refresh} />
    </div>
  );
};

export default App;