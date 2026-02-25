import React, { useState } from 'react';
import ConfirmationDialog from '../ConfirmationDialog.jsx';

const StudentsPage = () => {
  const [students, setStudents] = useState([
    { id: 'S2023001', name: 'John Smith', grade: 'Grade 10A', enrollmentDate: '2023-08-15', status: 'Active', email: 'john.smith@student.edu', phone: '123-456-7890', address: '123 Main St, City, State', dob: '2005-03-15' },
    { id: 'S2023002', name: 'Emily Johnson', grade: 'Grade 11B', enrollmentDate: '2023-08-15', status: 'Active', email: 'emily.johnson@student.edu', phone: '123-456-7891', address: '456 Oak St, City, State', dob: '2004-07-22' },
    { id: 'S2023003', name: 'Michael Brown', grade: 'Grade 9C', enrollmentDate: '2023-08-16', status: 'Probation', email: 'michael.brown@student.edu', phone: '123-456-7892', address: '789 Pine St, City, State', dob: '2006-11-05' }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (studentId) => {
    setItemToDelete(studentId);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    setStudents(students.filter(student => student.id !== itemToDelete));
    setShowDialog(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setItemToDelete(null);
  };

  return (
    <div id="students-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">👥 Student Management</h1>
        <p className="page-subtitle">Manage student records, enrollment, and academic progress</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--primary)'}}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{students.length}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{students.filter(s => s.status === 'Active').length}</h3>
            <p>Active Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{students.filter(s => s.status === 'Probation').length}</h3>
            <p>On Probation</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--accent)'}}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-info">
            <h3>4</h3>
            <p>Enrolled Programs</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Student Records</h2>
          <button className="btn btn-primary" id="add-student-btn-2"><i className="fas fa-plus"></i> Add New Student</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Grade/Class</th>
              <th>Enrollment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="student-table-body">
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.enrollmentDate}</td>
                <td>
                  <span className={`badge badge-${student.status === 'Active' ? 'success' : student.status === 'Probation' ? 'warning' : 'danger'}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-outline view-student-btn" data-id={student.id}><i className="fas fa-eye"></i></button>
                    <button className="btn btn-primary edit-student-btn" data-id={student.id}><i className="fas fa-edit"></i></button>
                    <button 
                      className="btn btn-danger delete-student-btn" 
                      onClick={() => handleDelete(student.id)}
                    ><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Student Statistics</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'var(--primary)'}}>
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>2,847</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'var(--success)'}}>
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-info">
              <h3>2,520</h3>
              <p>Active Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'var(--warning)'}}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h3>45</h3>
              <p>On Probation</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'var(--danger)'}}>
              <i className="fas fa-user-times"></i>
            </div>
            <div className="stat-info">
              <h3>282</h3>
              <p>Inactive Students</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog 
        show={showDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this student? This action cannot be undone."
      />
    </div>
  );
};

export default StudentsPage;