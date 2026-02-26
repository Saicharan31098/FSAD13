import React, { useState, useEffect } from 'react';
import ConfirmationDialog from '../ConfirmationDialog.jsx';
import { AdminAPI } from '../../services/api.js';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: 'Grade 10A',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    email: '',
    phone: '',
    address: '',
    dob: ''
  });

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  // Fetch all students
  const loadStudents = () => {
    setLoading(true);
    const result = AdminAPI.getAllStudents();
    if (result.success) {
      setStudents(result.data);
      setError(null);
    } else {
      // Fallback to sample data if not yet initialized
      setStudents([
        { id: 'S2023001', name: 'John Smith', grade: 'Grade 10A', enrollmentDate: '2023-08-15', status: 'Active', email: 'john.smith@student.edu', phone: '123-456-7890', address: '123 Main St, City, State', dob: '2005-03-15' },
        { id: 'S2023002', name: 'Emily Johnson', grade: 'Grade 11B', enrollmentDate: '2023-08-15', status: 'Active', email: 'emily.johnson@student.edu', phone: '123-456-7891', address: '456 Oak St, City, State', dob: '2004-07-22' },
        { id: 'S2023003', name: 'Michael Brown', grade: 'Grade 9C', enrollmentDate: '2023-08-16', status: 'Probation', email: 'michael.brown@student.edu', phone: '123-456-7892', address: '789 Pine St, City, State', dob: '2006-11-05' }
      ]);
    }
    setLoading(false);
  };

  // Handle Add Student button click
  const handleAddStudentClick = () => {
    setFormData({
      name: '',
      grade: 'Grade 10A',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      email: '',
      phone: '',
      address: '',
      dob: ''
    });
    setShowAddModal(true);
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save new student
  const handleSaveNewStudent = () => {
    if (!formData.name || !formData.email) {
      setError('Please fill all required fields (Name, Email)');
      return;
    }

    const result = AdminAPI.addStudent(formData);
    if (result.success) {
      setStudents([...students, result.data]);
      setShowAddModal(false);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  // Handle Edit Student button click
  const handleEditStudentClick = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      grade: student.grade,
      enrollmentDate: student.enrollmentDate,
      status: student.status,
      email: student.email,
      phone: student.phone,
      address: student.address,
      dob: student.dob
    });
    setShowEditModal(true);
  };

  // Handle save edited student
  const handleSaveEditedStudent = () => {
    if (!formData.name || !formData.email) {
      setError('Please fill all required fields (Name, Email)');
      return;
    }

    const result = AdminAPI.updateStudent(selectedStudent.id, formData);
    if (result.success) {
      setStudents(students.map(s => s.id === selectedStudent.id ? result.data : s));
      setShowEditModal(false);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  // Handle Delete Student button click
  const handleDeleteStudentClick = (student) => {
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  // Confirm delete student
  const confirmDelete = () => {
    const result = AdminAPI.deleteStudent(selectedStudent.id);
    if (result.success) {
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setError(null);
    } else {
      setError(result.error);
    }
    setShowDeleteDialog(false);
    setSelectedStudent(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedStudent(null);
  };

  return (
    <div id="students-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">👥 Student Management</h1>
        <p className="page-subtitle">Manage student records, enrollment, and academic progress</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px 15px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666'
        }}>
          Loading...
        </div>
      )}
      
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
          <button 
            className="btn btn-primary"
            onClick={handleAddStudentClick}
          >
            <i className="fas fa-plus"></i> Add New Student
          </button>
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
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No students found
                </td>
              </tr>
            ) : (
              students.map(student => (
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
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleEditStudentClick(student)}
                        title="Edit Student"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteStudentClick(student)}
                        title="Delete Student"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
              <h3>{students.length}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'var(--success)'}}>
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-info">
              <h3>{students.filter(s => s.status === 'Active').length}</h3>
              <p>Active Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'var(--warning)'}}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h3>{students.filter(s => s.status === 'Probation').length}</h3>
              <p>On Probation</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'var(--danger)'}}>
              <i className="fas fa-user-times"></i>
            </div>
            <div className="stat-info">
              <h3>{students.filter(s => s.status === 'Inactive').length}</h3>
              <p>Inactive Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter student name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Enter phone number"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Grade/Class</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Grade 9A">Grade 9A</option>
                  <option value="Grade 9B">Grade 9B</option>
                  <option value="Grade 9C">Grade 9C</option>
                  <option value="Grade 10A">Grade 10A</option>
                  <option value="Grade 10B">Grade 10B</option>
                  <option value="Grade 11A">Grade 11A</option>
                  <option value="Grade 11B">Grade 11B</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
              <div className="form-group">
                <label>Enrollment Date</label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="Enter address"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="Probation">Probation</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveNewStudent}
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  value={selectedStudent.id}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter student name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Enter phone number"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Grade/Class</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Grade 9A">Grade 9A</option>
                  <option value="Grade 9B">Grade 9B</option>
                  <option value="Grade 9C">Grade 9C</option>
                  <option value="Grade 10A">Grade 10A</option>
                  <option value="Grade 10B">Grade 10B</option>
                  <option value="Grade 11A">Grade 11A</option>
                  <option value="Grade 11B">Grade 11B</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
              <div className="form-group">
                <label>Enrollment Date</label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="Enter address"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="Probation">Probation</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveEditedStudent}
              >
                Update Student
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog 
        show={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Student Deletion"
        message={`Are you sure you want to delete the student "${selectedStudent?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default StudentsPage;