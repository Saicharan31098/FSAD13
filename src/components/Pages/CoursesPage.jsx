import React, { useEffect, useState } from 'react';
import ConfirmationDialog from '../ConfirmationDialog';
import { AdminAPI } from '../../services/api';

const CoursesPage = ({ user }) => {
  const [courses, setCourses] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (courseCode) => {
    setItemToDelete(courseCode);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    (async () => {
      // try network-first delete, then refresh
      try {
        const res = await AdminAPI.deleteCourseNetwork(itemToDelete);
        if (res && res.success) {
          // refresh list from storage
          const all = AdminAPI.getAllCourses().data || [];
          const normalized = all.map((c) => ({
            code: c.code || c.id,
            name: c.name || c.title || 'Untitled',
            department: c.department || 'General',
            credits: c.credits || c.credit || 0,
            instructor: c.instructor || c.teacher || 'TBA',
            capacity: c.capacity || 0,
            enrolled: c.enrolled || 0,
            description: c.description || '',
            status: c.status || 'Active',
          }));
          setCourses(normalized);
        } else {
          // fallback: remove locally
          const updated = courses.filter(course => course.code !== itemToDelete);
          localStorage.setItem('erp_courses', JSON.stringify(updated));
          setCourses(updated);
        }
      } catch (e) {
        const updated = courses.filter(course => course.code !== itemToDelete);
        localStorage.setItem('erp_courses', JSON.stringify(updated));
        setCourses(updated);
      }
      setShowDialog(false);
      setItemToDelete(null);
    })();
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    // load courses from AdminAPI/localStorage
    const res = AdminAPI.getAllCourses();
    if (res.success) {
      // ensure items have `code` for compatibility with table (use code or id)
      const normalized = res.data.map((c) => ({
        code: c.code || c.id,
        name: c.name || c.title || 'Untitled',
        department: c.department || 'General',
        credits: c.credits || c.credit || 0,
        instructor: c.instructor || c.teacher || 'TBA',
        capacity: c.capacity || 0,
        enrolled: c.enrolled || 0,
        description: c.description || '',
        status: c.status || 'Active',
      }));
      setCourses(normalized.length ? normalized : [
        { code: 'MATH101', name: 'Calculus I', department: 'Mathematics', credits: 4, instructor: 'Dr. Robert Miller', capacity: 50, enrolled: 45, description: 'Introduction to differential and integral calculus', status: 'Active' },
        { code: 'PHYS201', name: 'Physics for Engineers', department: 'Science', credits: 3, instructor: 'Prof. Jennifer Lee', capacity: 40, enrolled: 38, description: 'Fundamental principles of physics with engineering applications', status: 'Active' },
        { code: 'COMP301', name: 'Data Structures', department: 'Computer Science', credits: 3, instructor: 'Dr. Samuel Wilson', capacity: 60, enrolled: 52, description: 'Study of fundamental data structures and algorithms', status: 'Active' }
      ]);
    }
  }, []);

  const handleView = (code) => {
    const c = courses.find(x => x.code === code);
    if (!c) return alert('Course not found');
    alert(`Course: ${c.name}\nCode: ${c.code}\nDept: ${c.department}\nInstructor: ${c.instructor}\nDescription: ${c.description}`);
  };

  const handleEdit = (code) => {
    (async () => {
      const idx = courses.findIndex(x => x.code === code);
      if (idx === -1) return alert('Course not found');
      const current = courses[idx];
      const newName = window.prompt('Edit course name', current.name);
      if (!newName) return;
      // try network-first update
      try {
        const res = await AdminAPI.updateCourseNetwork(code, { name: newName });
        if (res && res.success) {
          const all = AdminAPI.getAllCourses().data || [];
          const normalized = all.map((c) => ({
            code: c.code || c.id,
            name: c.name || c.title || 'Untitled',
            department: c.department || 'General',
            credits: c.credits || c.credit || 0,
            instructor: c.instructor || c.teacher || 'TBA',
            capacity: c.capacity || 0,
            enrolled: c.enrolled || 0,
            description: c.description || '',
            status: c.status || 'Active',
          }));
          setCourses(normalized);
          return;
        }
      } catch (e) {
        // fallback to local update
      }

      const updated = [...courses];
      updated[idx] = { ...current, name: newName };
      try {
        const all = AdminAPI.getAllCourses().data || [];
        const mapIdx = all.findIndex(a => (a.code || a.id) === code);
        if (mapIdx > -1) {
          all[mapIdx] = { ...all[mapIdx], name: newName };
          localStorage.setItem('erp_courses', JSON.stringify(all));
        }
      } catch (e) {
        // fallback
      }
      setCourses(updated);
    })();
  };

  const handleAdd = () => {
    (async () => {
      const code = window.prompt('Course code (e.g. CS101)');
      if (!code) return;
      const name = window.prompt('Course name');
      if (!name) return;
      const newCourse = { code, name, department: 'General', credits: 3, instructor: 'TBA', capacity: 0, enrolled: 0, description: '', status: 'Active' };
      try {
        const res = await AdminAPI.createCourseNetwork(newCourse);
        if (res && res.success) {
          const all = AdminAPI.getAllCourses().data || [];
          const normalized = all.map((c) => ({
            code: c.code || c.id,
            name: c.name || c.title || 'Untitled',
            department: c.department || 'General',
            credits: c.credits || c.credit || 0,
            instructor: c.instructor || c.teacher || 'TBA',
            capacity: c.capacity || 0,
            enrolled: c.enrolled || 0,
            description: c.description || '',
            status: c.status || 'Active',
          }));
          setCourses(normalized);
          return;
        }
      } catch (e) {
        // fallback
      }
      const updated = [...courses, newCourse];
      const stored = AdminAPI.getAllCourses().data || [];
      stored.push(newCourse);
      localStorage.setItem('erp_courses', JSON.stringify(stored));
      setCourses(updated);
    })();
  };

  return (
    <div id="courses-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📚 Course Management</h1>
        <p className="page-subtitle">Manage course catalog, enrollment, and materials</p>
      </div>
      
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
          {/* Hide add-course button for students */}
          {user?.role?.toLowerCase() !== 'student' && (
            <button className="btn btn-primary" id="add-course-btn-2"><i className="fas fa-plus"></i> Add New Course</button>
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
            {courses.map(course => (
              <tr key={course.code}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.department}</td>
                <td>{course.credits}</td>
                <td>{course.instructor}</td>
                <td>{course.enrolled}/{course.capacity}</td>
                <td><span className="badge badge-success">{course.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-outline view-course-btn" data-id={course.code} onClick={() => handleView(course.code)}><i className="fas fa-eye"></i></button>
                    {/* Only non-students can edit or delete courses */}
                    {user?.role?.toLowerCase() !== 'student' ? (
                      <>
                        <button className="btn btn-primary edit-course-btn" data-id={course.code} onClick={() => handleEdit(course.code)}><i className="fas fa-edit"></i></button>
                        <button 
                          className="btn btn-danger delete-course-btn" 
                          onClick={() => handleDelete(course.code)}
                        ><i className="fas fa-trash"></i></button>
                      </>
                    ) : null}
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
        message="Are you sure you want to delete this course? This action cannot be undone."
      />
    </div>
  );
};

export default CoursesPage;