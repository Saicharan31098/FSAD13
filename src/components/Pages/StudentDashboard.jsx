import React, { useState } from "react";

export default function StudentDashboard({ user }) {
  const [selectedSemester, setSelectedSemester] = useState("6");

  // Prefer the logged-in user's details when available, otherwise fall back to demo data
  const studentInfo = {
    id: "STU001234",
    name: user?.username || "John Doe",
    email: user?.email || "john.doe@university.edu",
    program: "B.Tech Computer Science",
  };

  const [semesterResults, setSemesterResults] = useState({
    "1": {
      cgpa: 3.2,
      sgpa: 3.5,
      totalCredits: 16,
      creditsEarned: 14,
      courses: [
        { code: "CS101", name: "Programming Fundamentals", grade: "A", credits: 4, marks: 88 },
        { code: "MA101", name: "Calculus I", grade: "B+", credits: 4, marks: 82 },
        { code: "PH101", name: "Physics I", grade: "A-", credits: 4, marks: 85 },
        { code: "ENG101", name: "English Communication", grade: "A", credits: 4, marks: 87 },
      ],
    },
    "2": {
      cgpa: 3.35,
      sgpa: 3.6,
      totalCredits: 16,
      creditsEarned: 16,
      courses: [
        { code: "CS102", name: "Data Structures", grade: "A", credits: 4, marks: 90 },
        { code: "MA102", name: "Linear Algebra", grade: "A-", credits: 4, marks: 86 },
        { code: "CS103", name: "Digital Logic", grade: "B+", credits: 4, marks: 83 },
        { code: "PH102", name: "Physics II", grade: "A", credits: 4, marks: 88 },
      ],
    },
    "3": {
      cgpa: 3.4,
      sgpa: 3.7,
      totalCredits: 16,
      creditsEarned: 16,
      courses: [
        { code: "CS201", name: "Algorithms", grade: "A+", credits: 4, marks: 92 },
        { code: "CS202", name: "Database Systems", grade: "A", credits: 4, marks: 89 },
        { code: "CS203", name: "Web Development", grade: "A-", credits: 4, marks: 87 },
        { code: "CS204", name: "Software Engineering", grade: "A", credits: 4, marks: 88 },
      ],
    },
    "4": {
      cgpa: 3.42,
      sgpa: 3.65,
      totalCredits: 16,
      creditsEarned: 16,
      courses: [
        { code: "CS301", name: "Operating Systems", grade: "A", credits: 4, marks: 88 },
        { code: "CS302", name: "Computer Networks", grade: "A-", credits: 4, marks: 86 },
        { code: "CS303", name: "Compiler Design", grade: "B+", credits: 4, marks: 84 },
        { code: "CS304", name: "AI & ML Basics", grade: "A", credits: 4, marks: 89 },
      ],
    },
    "5": {
      cgpa: 3.45,
      sgpa: 3.75,
      totalCredits: 16,
      creditsEarned: 16,
      courses: [
        { code: "CS401", name: "Cloud Computing", grade: "A+", credits: 4, marks: 91 },
        { code: "CS402", name: "Big Data Analytics", grade: "A", credits: 4, marks: 89 },
        { code: "CS403", name: "Cybersecurity", grade: "A", credits: 4, marks: 90 },
        { code: "CS404", name: "Advanced AI", grade: "A-", credits: 4, marks: 87 },
      ],
    },
    "6": {
      cgpa: 3.48,
      sgpa: 3.8,
      totalCredits: 16,
      creditsEarned: 16,
      courses: [
        { code: "CS501", name: "Machine Learning", grade: "A+", credits: 4, marks: 93 },
        { code: "CS502", name: "Blockchain Technology", grade: "A", credits: 4, marks: 90 },
        { code: "CS503", name: "IoT Applications", grade: "A+", credits: 4, marks: 92 },
        { code: "CS504", name: "Mobile Development", grade: "A", credits: 4, marks: 89 },
      ],
    },
  });

  const currentSemesterData = semesterResults[selectedSemester];

  const getGradeColor = (grade) => {
    if (grade.startsWith("A+") || grade === "A+") return "#4CAF50";
    if (grade.startsWith("A")) return "#66BB6A";
    if (grade.startsWith("B+")) return "#42A5F5";
    if (grade.startsWith("B")) return "#2196F3";
    if (grade.startsWith("C")) return "#FF9800";
    return "#F44336";
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Student Dashboard</h1>
      <p className="page-subtitle">Welcome, {user?.username}! Review your academic performance.</p>

      {/* Student Information Card */}
      <div className="student-info-card">
        <div className="info-section">
          <i className="fa-solid fa-user"></i>
          <div>
            <label>Student ID</label>
            <p>{studentInfo.id}</p>
          </div>
        </div>
        <div className="info-section">
          <i className="fa-solid fa-envelope"></i>
          <div>
            <label>Email</label>
            <p>{studentInfo.email}</p>
          </div>
        </div>
        <div className="info-section">
          <i className="fa-solid fa-graduation-cap"></i>
          <div>
            <label>Program</label>
            <p>{studentInfo.program}</p>
          </div>
        </div>
      </div>

      {/* Semester Selection */}
      <div className="section-card">
        <h2 style={{ color: '#000' }}>Select Semester</h2>
        <div className="semester-selector">
          {Object.keys(semesterResults).map((sem) => (
            <button
              key={sem}
              className={`semester-btn ${selectedSemester === sem ? "active" : ""}`}
              onClick={() => setSelectedSemester(sem)}
            >
              Semester {sem}
            </button>
          ))}
        </div>
      </div>

      {/* CGPA and SGPA */}
      <div className="gpa-cards">
        <div className="gpa-card cgpa">
          <div className="gpa-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div className="gpa-content">
            <h3>CGPA</h3>
            <p className="gpa-value">{currentSemesterData.cgpa.toFixed(2)}</p>
            <small>Cumulative GPA</small>
          </div>
        </div>

        <div className="gpa-card sgpa">
          <div className="gpa-icon">
            <i className="fa-solid fa-chart-simple"></i>
          </div>
          <div className="gpa-content">
            <h3>SGPA</h3>
            <p className="gpa-value">{currentSemesterData.sgpa.toFixed(2)}</p>
            <small>Semester GPA</small>
          </div>
        </div>

        <div className="gpa-card credits">
          <div className="gpa-icon">
            <i className="fa-solid fa-book"></i>
          </div>
          <div className="gpa-content">
            <h3>Credits Earned</h3>
            <p className="gpa-value">{currentSemesterData.creditsEarned}/{currentSemesterData.totalCredits}</p>
            <small>Out of {currentSemesterData.totalCredits}</small>
          </div>
        </div>
      </div>

      {/* Course Results Table */}
      <div className="section-card">
        <h2>Semester {selectedSemester} - Course Details</h2>
        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {currentSemesterData.courses.map((course, idx) => (
                <tr key={idx}>
                  <td className="course-code">{course.code}</td>
                  <td className="course-name">{course.name}</td>
                  <td className="credits">{course.credits}</td>
                  <td className="marks">{course.marks}</td>
                  <td>
                    <span
                      className="grade-badge"
                      style={{ backgroundColor: getGradeColor(course.grade) }}
                    >
                      {course.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="performance-summary">
        <h2>Performance Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <i className="fa-solid fa-medal"></i>
            <h4>Overall Performance</h4>
            <p className={currentSemesterData.sgpa >= 3.5 ? "excellent" : "good"}>
              {currentSemesterData.sgpa >= 3.7
                ? "Excellent 🌟"
                : currentSemesterData.sgpa >= 3.5
                ? "Very Good 👍"
                : "Good"}
            </p>
          </div>
          <div className="summary-item">
            <i className="fa-solid fa-trending-up"></i>
            <h4>Academic Standing</h4>
            <p>In Good Standing</p>
          </div>
          <div className="summary-item">
            <i className="fa-solid fa-calendar-check"></i>
            <h4>Current Status</h4>
            <p>Active Semester {selectedSemester}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
