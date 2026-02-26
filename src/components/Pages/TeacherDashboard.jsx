import React, { useState, useEffect } from "react";
import CreateAssignmentModal from "./CreateAssignmentModal";
import PostMarksModal from "./PostMarksModal";
import { TeacherAPI } from "../../services/api";

export default function TeacherDashboard({ user, setActivePage }) {
  const [selectedClass, setSelectedClass] = useState("CS101");
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showPostMarks, setShowPostMarks] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [studentProgress, setStudentProgress] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      assignmentMarks: 85,
      dailyWork: 90,
      attendance: 95,
      projectMarks: 88,
      overallGrade: "A",
    },
    {
      id: 2,
      name: "Bob Smith",
      assignmentMarks: 78,
      dailyWork: 82,
      attendance: 88,
      projectMarks: 80,
      overallGrade: "B+",
    },
    {
      id: 3,
      name: "Carol Williams",
      assignmentMarks: 92,
      dailyWork: 95,
      attendance: 100,
      projectMarks: 94,
      overallGrade: "A+",
    },
    {
      id: 4,
      name: "David Brown",
      assignmentMarks: 72,
      dailyWork: 65,
      attendance: 78,
      projectMarks: 75,
      overallGrade: "B",
    },
  ]);

  const [classes] = useState([
    { id: "CS101", name: "Data Structures & Algorithms" },
    { id: "CS102", name: "Web Development" },
    { id: "CS103", name: "Database Management" },
  ]);

  const [dailyStats] = useState({
    classesScheduled: 4,
    studentsAssigned: 124,
    assignmentsPending: 8,
    avgPerformance: 86,
  });

  const [assignments, setAssignments] = useState([]);

  // load assignments whenever class changes
  React.useEffect(() => {
    if (selectedClass) {
      const res = TeacherAPI.getAssignments(selectedClass);
      if (res.success) {
        setAssignments(res.data);
      }
    }
  }, [selectedClass]);

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "#4CAF50";
    if (grade.startsWith("B")) return "#2196F3";
    if (grade.startsWith("C")) return "#FF9800";
    return "#F44336";
  };

  const handleCreateAssignmentClick = () => {
    setShowCreateAssignment(true);
  };

  // export progress as CSV
  const handleExportReport = () => {
    const header = [
      "Student Name",
      "Assignment Marks",
      "Daily Work",
      "Attendance",
      "Project Marks",
      "Overall Grade",
    ];
    const rows = studentProgress.map((s) => [
      s.name,
      s.assignmentMarks,
      s.dailyWork,
      s.attendance,
      s.projectMarks,
      s.overallGrade,
    ]);
    const csvContent = [header, ...rows]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedClass || "class"}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePostMarksClick = (student) => {
    setSelectedStudent(student);
    setShowPostMarks(true);
  };

  const handleAssignmentSuccess = (newAssignment) => {
    console.log("Assignment created:", newAssignment);
    // refresh assignments list
    const res = TeacherAPI.getAssignments(selectedClass);
    if (res.success) {
      setAssignments(res.data);
    }
  };

  const handleMarksSuccess = (marksData) => {
    console.log("Marks posted:", marksData);
    // Optionally update student progress
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Teacher Dashboard</h1>
      <p className="page-subtitle">Welcome, {user?.username}! Monitor your students' progress.</p>

      {/* Daily Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#4CAF50" }}>
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{dailyStats.classesScheduled}</h3>
            <p>Classes Scheduled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#2196F3" }}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{dailyStats.studentsAssigned}</h3>
            <p>Students Assigned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#FF9800" }}>
            <i className="fa-solid fa-tasks"></i>
          </div>
          <div className="stat-content">
            <h3>{dailyStats.assignmentsPending}</h3>
            <p>Pending Assignments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#9C27B0" }}>
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>{dailyStats.avgPerformance}%</h3>
            <p>Class Average</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#3f51b5" }}>
            <i className="fa-solid fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{assignments.length}</h3>
            <p>Assignments Created</p>
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="section-card">
        <h2 style={{color:'#000'}}>Select Class</h2>
        <div className="class-selector">
          {classes.map((cls) => (
            <button
              key={cls.id}
              className={`class-btn ${selectedClass === cls.id ? "active" : ""}`}
              onClick={() => setSelectedClass(cls.id)}
            >
              <span className="class-code">{cls.id}</span>
              <span className="class-name">{cls.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="section-card">
        <div className="section-header">
          <h2>Student Progress - {classes.find(c => c.id === selectedClass)?.name}</h2>
          <button className="export-btn">
            <i className="fa-solid fa-download"></i> Export Report
          </button>
        </div>

        <div className="progress-table-container">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Assignment Marks</th>
                <th>Daily Work</th>
                <th>Attendance</th>
                <th>Project Marks</th>
                <th>Overall Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentProgress.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  style={{ cursor: 'pointer', backgroundColor: selectedStudent?.id === student.id ? 'rgba(0,0,0,0.05)' : 'transparent' }}
                >
                  <td className="student-name">{student.name}</td>
                  <td className="marks">{student.assignmentMarks}%</td>
                  <td className="marks">{student.dailyWork}%</td>
                  <td className="marks">{student.attendance}%</td>
                  <td className="marks">{student.projectMarks}%</td>
                  <td>
                    <span
                      className="grade-badge"
                      style={{ backgroundColor: getGradeColor(student.overallGrade) }}
                    >
                      {student.overallGrade}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="action-icon" title="View Details" onClick={() => alert(`View ${student.name}'s profile`)}>
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button 
                      className="action-icon" 
                      title="Update Marks"
                      onClick={() => handlePostMarksClick(student)}
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={handleCreateAssignmentClick}>
            <i className="fa-solid fa-plus"></i>
            <span>Create Assignment</span>
          </button>
          <button className="action-btn" onClick={handleExportReport}>
            <i className="fa-solid fa-download"></i>
            <span>Export Report</span>
          </button>
          <button
            className="action-btn"
            onClick={() => {
              if (selectedStudent) {
                handlePostMarksClick(selectedStudent);
              } else {
                alert('Select a student row above then click this button to update marks.');
              }
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Update Marks</span>
          </button>
          <button
            className="action-btn"
            onClick={() => setActivePage && setActivePage('announcements-page')}
          >
            <i className="fa-solid fa-bell"></i>
            <span>Send Announcement</span>
          </button>
          <button
            className="action-btn"
            onClick={() => setActivePage && setActivePage('attendance-page')}
          >
            <i className="fa-solid fa-clipboard-list"></i>
            <span>Mark Attendance</span>
          </button>
          <button
            className="action-btn"
            onClick={() => setActivePage && setActivePage('reports-page')}
          >
            <i className="fa-solid fa-chart-bar"></i>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateAssignmentModal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
        courseId={selectedClass}
        onSuccess={handleAssignmentSuccess}
      />

      <PostMarksModal
        isOpen={showPostMarks}
        onClose={() => setShowPostMarks(false)}
        courseId={selectedClass}
        studentId={selectedStudent?.id}
        studentName={selectedStudent?.name}
        onSuccess={handleMarksSuccess}
      />
    </div>
  );
}
