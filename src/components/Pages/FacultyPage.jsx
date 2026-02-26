import React, { useState, useEffect } from 'react';
import ConfirmationDialog from '../ConfirmationDialog';
import { FacultyAPI } from '../../services/api.js';

const FacultyPage = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: 'Mathematics',
    position: 'Assistant Professor',
    email: '',
    phone: '',
    qualification: '',
    status: 'Active'
  });

  // Load faculty on component mount
  useEffect(() => {
    loadFaculty();
  }, []);

  // Fetch all faculty
  const loadFaculty = () => {
    setLoading(true);
    const result = FacultyAPI.getAllFaculty();
    if (result.success) {
      setFaculty(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Handle Add Faculty button click
  const handleAddFacultyClick = () => {
    setFormData({
      name: '',
      department: 'Mathematics',
      position: 'Assistant Professor',
      email: '',
      phone: '',
      qualification: '',
      status: 'Active'
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

  // Handle save new faculty
  const handleSaveNewFaculty = () => {
    if (!formData.name || !formData.email) {
      setError('Please fill all required fields (Name, Email)');
      return;
    }

    const result = FacultyAPI.addFaculty(formData);
    if (result.success) {
      setFaculty([...faculty, result.data]);
      setShowAddModal(false);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  // Handle Edit Faculty button click
  const handleEditFacultyClick = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setFormData({
      name: facultyMember.name,
      department: facultyMember.department,
      position: facultyMember.position,
      email: facultyMember.email,
      phone: facultyMember.phone,
      qualification: facultyMember.qualification,
      status: facultyMember.status
    });
    setShowEditModal(true);
  };

  // Handle save edited faculty
  const handleSaveEditedFaculty = () => {
    if (!formData.name || !formData.email) {
      setError('Please fill all required fields (Name, Email)');
      return;
    }

    const result = FacultyAPI.updateFaculty(selectedFaculty.id, formData);
    if (result.success) {
      setFaculty(faculty.map(f => f.id === selectedFaculty.id ? result.data : f));
      setShowEditModal(false);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  // Handle Delete Faculty button click
  const handleDeleteFacultyClick = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setShowDeleteDialog(true);
  };

  // Confirm delete faculty
  const confirmDelete = () => {
    const result = FacultyAPI.deleteFaculty(selectedFaculty.id);
    if (result.success) {
      setFaculty(faculty.filter(f => f.id !== selectedFaculty.id));
      setError(null);
    } else {
      setError(result.error);
    }
    setShowDeleteDialog(false);
    setSelectedFaculty(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedFaculty(null);
  };

  return (
    <div id="faculty-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">👨‍🏫 Faculty Management</h1>
        <p className="page-subtitle">Manage faculty records, assignments, and performance</p>
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
          <button 
            className="btn btn-primary"
            onClick={handleAddFacultyClick}
          >
            <i className="fas fa-plus"></i> Add New Faculty
          </button>
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
            {faculty.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No faculty members found
                </td>
              </tr>
            ) : (
              faculty.map(facultyMember => (
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
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleEditFacultyClick(facultyMember)}
                        title="Edit Faculty"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteFacultyClick(facultyMember)}
                        title="Delete Faculty"
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

      {/* Add Faculty Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Faculty</h2>
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
                  placeholder="Enter faculty name"
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
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleFormChange}
                  placeholder="e.g., Ph.D. in Mathematics"
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
                  <option value="On Leave">On Leave</option>
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
                onClick={handleSaveNewFaculty}
              >
                Add Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Faculty Modal */}
      {showEditModal && selectedFaculty && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Faculty</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Faculty ID</label>
                <input
                  type="text"
                  value={selectedFaculty.id}
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
                  placeholder="Enter faculty name"
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
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleFormChange}
                  placeholder="e.g., Ph.D. in Mathematics"
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
                  <option value="On Leave">On Leave</option>
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
                onClick={handleSaveEditedFaculty}
              >
                Update Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog 
        show={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Faculty Deletion"
        message={`Are you sure you want to delete "${selectedFaculty?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default FacultyPage;