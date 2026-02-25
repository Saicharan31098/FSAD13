import React, { useState } from 'react';
import ConfirmationDialog from '../ConfirmationDialog';

const FacultyPage = () => {
  const [faculty, setFaculty] = useState([
    { id: 'F2023001', name: 'Dr. Robert Miller', department: 'Mathematics', position: 'Professor', email: 'robert.m@unierp.edu', phone: '123-456-7801', qualification: 'Ph.D. in Mathematics', status: 'Active' },
    { id: 'F2023002', name: 'Prof. Jennifer Lee', department: 'Science', position: 'Associate Professor', email: 'jennifer.l@unierp.edu', phone: '123-456-7802', qualification: 'Ph.D. in Physics', status: 'Active' },
    { id: 'F2023003', name: 'Dr. Samuel Wilson', department: 'Computer Science', position: 'Assistant Professor', email: 'samuel.w@unierp.edu', phone: '123-456-7803', qualification: 'Ph.D. in Computer Science', status: 'On Leave' }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (facultyId) => {
    setItemToDelete(facultyId);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    setFaculty(faculty.filter(facultyMember => facultyMember.id !== itemToDelete));
    setShowDialog(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setItemToDelete(null);
  };

  return (
    <div id="faculty-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">👨‍🏫 Faculty Management</h1>
        <p className="page-subtitle">Manage faculty records, assignments, and performance</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--primary)'}}>
            <i className="fas fa-chalkboard-user"></i>
          </div>
          <div className="stat-info">
            <h3>{faculty.length}</h3>
            <p>Total Faculty</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-info">
            <h3>{faculty.filter(f => f.status === 'Active').length}</h3>
            <p>Active Faculty</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{faculty.filter(f => f.status === 'On Leave').length}</h3>
            <p>On Leave</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--accent)'}}>
            <i className="fas fa-list-check"></i>
          </div>
          <div className="stat-info">
            <h3>24</h3>
            <p>Total Courses</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Faculty Members</h2>
          <button className="btn btn-primary" id="add-faculty-btn"><i className="fas fa-plus"></i> Add New Faculty</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="faculty-table-body">
            {faculty.map(facultyMember => (
              <tr key={facultyMember.id}>
                <td>{facultyMember.id}</td>
                <td>{facultyMember.name}</td>
                <td>{facultyMember.department}</td>
                <td>{facultyMember.position}</td>
                <td>{facultyMember.email}</td>
                <td>
                  <span className={`badge badge-${facultyMember.status === 'Active' ? 'success' : 'warning'}`}>
                    {facultyMember.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-outline view-faculty-btn" data-id={facultyMember.id}><i className="fas fa-eye"></i></button>
                    <button className="btn btn-primary edit-faculty-btn" data-id={facultyMember.id}><i className="fas fa-edit"></i></button>
                    <button 
                      className="btn btn-danger delete-faculty-btn" 
                      onClick={() => handleDelete(facultyMember.id)}
                    ><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog 
        show={showDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this faculty member? This action cannot be undone."
      />
    </div>
  );
};

export default FacultyPage;