import React, { useEffect, useState } from 'react';
import ConfirmationDialog from '../ConfirmationDialog';
import { AdminAPI } from '../../services/api';

const CoursesPage = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'General',
    credits: '3',
    instructor: '',
    capacity: '',
    description: '',
    status: 'Active'
  });

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Fetch all courses
  const loadCourses = () => {
    setLoading(true);
    const res = AdminAPI.getAllCourses();
    if (res.success && res.data.length > 0) {
      setCourses(res.data);
      setError(null);
    } else {
      // Default courses if none found
      const defaultCourses = [
        { code: 'MATH101', name: 'Calculus I', department: 'Mathematics', credits: 4, instructor: 'Dr. Robert Miller', capacity: 50, enrolled: 45, description: 'Introduction to differential and integral calculus', status: 'Active' },
        { code: 'PHYS201', name: 'Physics for Engineers', department: 'Science', credits: 3, instructor: 'Prof. Jennifer Lee', capacity: 40, enrolled: 38, description: 'Fundamental principles of physics with engineering applications', status: 'Active' },
        { code: 'COMP301', name: 'Data Structures', department: 'Computer Science', credits: 3, instructor: 'Dr. Samuel Wilson', capacity: 60, enrolled: 52, description: 'Study of fundamental data structures and algorithms', status: 'Active' }
      ];
      localStorage.setItem('erp_courses', JSON.stringify(defaultCourses));
      setCourses(defaultCourses);
    }
    setLoading(false);
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Add Course button click
  const handleAddCourseClick = () => {
    setFormData({
      code: '',
      name: '',
      department: 'General',
      credits: '3',
      instructor: '',
      capacity: '',
      description: '',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  // Handle save new course
  const handleSaveNewCourse = () => {
    if (!formData.code || !formData.name || !formData.instructor) {
      setError('Please fill all required fields (Code, Name, Instructor)');
      return;
    }

    const newCourse = {
      code: formData.code,
      name: formData.name,
      department: formData.department,
      credits: parseInt(formData.credits) || 3,
      instructor: formData.instructor,
      capacity: parseInt(formData.capacity) || 0,
      enrolled: 0,
      description: formData.description,
      status: formData.status
    };

    // Check if course code already exists
    if (courses.find(c => c.code === newCourse.code)) {
      setError('Course code already exists');
      return;
    }

    const result = AdminAPI.createCourse(newCourse);
    if (result.success) {
      setCourses([...courses, result.data]);
      setShowAddModal(false);
      setError(null);
    } else {
      setError(result.error || 'Failed to add course');
    }
  };

  // Handle Edit Course button click
  const handleEditCourseClick = (course) => {
    setSelectedCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      department: course.department,
      credits: course.credits.toString(),
      instructor: course.instructor,
      capacity: course.capacity.toString(),
      description: course.description,
      status: course.status
    });
    setShowEditModal(true);
  };

  // Handle save edited course
  const handleSaveEditedCourse = () => {
    if (!formData.code || !formData.name || !formData.instructor) {
      setError('Please fill all required fields (Code, Name, Instructor)');
      return;
    }

    const updatedCourse = {
      code: formData.code,
      name: formData.name,
      department: formData.department,
      credits: parseInt(formData.credits) || 3,
      instructor: formData.instructor,
      capacity: parseInt(formData.capacity) || 0,
      enrolled: selectedCourse.enrolled,
      description: formData.description,
      status: formData.status
    };

    const result = AdminAPI.updateCourse(selectedCourse.code, updatedCourse);
    if (result.success) {
      setCourses(courses.map(c => c.code === selectedCourse.code ? result.data : c));
      setShowEditModal(false);
      setError(null);
      setSelectedCourse(null);
    } else {
      setError(result.error || 'Failed to update course');
    }
  };

  // Handle View Course
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    // Show details in a modal or similar
    alert(`
Course: ${course.name}
Code: ${course.code}
Department: ${course.department}
Credits: ${course.credits}
Instructor: ${course.instructor}
Capacity: ${course.capacity}
Enrolled: ${course.enrolled}
Description: ${course.description}
Status: ${course.status}
    `);
  };

  // Handle Delete Course button click
  const handleDeleteCourseClick = (course) => {
    setSelectedCourse(course);
    setShowDeleteDialog(true);
  };

  // Confirm delete course
  const confirmDelete = () => {
    const result = AdminAPI.deleteCourse(selectedCourse.code);
    if (result.success) {
      setCourses(courses.filter(c => c.code !== selectedCourse.code));
      setError(null);
    } else {
      setError(result.error || 'Failed to delete course');
    }
    setShowDeleteDialog(false);
    setSelectedCourse(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedCourse(null);
  };

  return (
    <div id="courses-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📚 Course Management</h1>
        <p className="page-subtitle">Manage course catalog, enrollment, and materials</p>
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
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-info">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{courses.reduce((sum, c) => sum + c.enrolled, 0)}</h3>
            <p>Total Enrolled</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--accent)'}}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-info">
            <h3>{courses.reduce((sum, c) => sum + c.credits, 0)}</h3>
            <p>Total Credits</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{courses.filter(c => c.status === 'Active').length}</h3>
            <p>Active Courses</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Course Catalog</h2>
          {user?.role?.toLowerCase() !== 'student' && (
            <button 
              className="btn btn-primary"
              onClick={handleAddCourseClick}
            >
              <i className="fas fa-plus"></i> Add New Course
            </button>
          )}
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Instructor</th>
              <th>Enrolled</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="course-table-body">
            {courses.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.code}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.department}</td>
                  <td>{course.credits}</td>
                  <td>{course.instructor}</td>
                  <td>{course.enrolled}/{course.capacity}</td>
                  <td>
                    <span className="badge badge-success">{course.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleViewCourse(course)}
                        title="View Course"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {user?.role?.toLowerCase() !== 'student' ? (
                        <>
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleEditCourseClick(course)}
                            title="Edit Course"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleDeleteCourseClick(course)}
                            title="Delete Course"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Course</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="e.g., CS101"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter course name"
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
                  <option value="General">General</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleFormChange}
                  placeholder="Enter credits"
                  className="form-control"
                  min="0"
                  max="10"
                />
              </div>
              <div className="form-group">
                <label>Instructor *</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleFormChange}
                  placeholder="Enter instructor name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  placeholder="Enter capacity"
                  className="form-control"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter course description"
                  className="form-control"
                  rows="3"
                ></textarea>
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
                  <option value="Inactive">Inactive</option>
                  <option value="Archived">Archived</option>
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
                onClick={handleSaveNewCourse}
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Course</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="e.g., CS101"
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter course name"
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
                  <option value="General">General</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleFormChange}
                  placeholder="Enter credits"
                  className="form-control"
                  min="0"
                  max="10"
                />
              </div>
              <div className="form-group">
                <label>Instructor *</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleFormChange}
                  placeholder="Enter instructor name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  placeholder="Enter capacity"
                  className="form-control"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter course description"
                  className="form-control"
                  rows="3"
                ></textarea>
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
                  <option value="Inactive">Inactive</option>
                  <option value="Archived">Archived</option>
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
                onClick={handleSaveEditedCourse}
              >
                Update Course
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog 
        show={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this course (${selectedCourse?.code} - ${selectedCourse?.name})? This action cannot be undone.`}
      />
    </div>
  );
};

export default CoursesPage;