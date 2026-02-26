import React, { useState } from "react";
import { TeacherAPI } from "../../services/api";

const TeacherAttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState("CS101");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students] = useState([
    { id: "S2023001", name: "John Smith" },
    { id: "S2023002", name: "Emily Johnson" },
    { id: "S2023003", name: "Michael Brown" },
    { id: "S2023004", name: "Alice Johnson" },
  ]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState(null);

  const classes = [
    { id: "CS101", name: "Data Structures & Algorithms" },
    { id: "CS102", name: "Web Development" },
    { id: "CS103", name: "Database Management" },
  ];

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => (updated[s.id] = status));
    setAttendance(updated);
  };

  const handleSubmit = () => {
    const payload = students.map((s) => ({
      courseId: selectedClass,
      studentId: s.id,
      date,
      status: attendance[s.id] || "absent",
      semester: 1,
    }));

    const res = TeacherAPI.markBatchAttendance(payload);
    if (res.success) {
      setMessage({ type: "success", text: res.message || "Attendance saved" });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save attendance" });
    }
  };

  return (
    <div id="teacher-attendance-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📝 Record Attendance</h1>
        <p className="page-subtitle">Mark present/absent for students in a class</p>
      </div>

      {message && (
        <div
          style={{
            padding: "10px",
            margin: "0 20px 20px",
            borderRadius: "4px",
            backgroundColor: message.type === "success" ? "#e6ffed" : "#ffe6e6",
            color: message.type === "success" ? "#2d662d" : "#a00",
            border: message.type === "success" ? "1px solid #8fce8f" : "1px solid #f99",
          }}
        >
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Class &amp; Date</h2>
        </div>
        <div className="form-row" style={{ padding: "15px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-control"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Students</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-small" onClick={() => markAll("present")}>All Present</button>
            <button className="btn btn-small" onClick={() => markAll("absent")}>All Absent</button>
          </div>
        </div>
        <table className="data-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>
                  <select
                    value={attendance[s.id] || "absent"}
                    onChange={(e) => handleStatusChange(s.id, e.target.value)}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "20px", textAlign: "right" }}>
        <button className="btn btn-primary" onClick={handleSubmit}>Save Attendance</button>
      </div>
    </div>
  );
};

export default TeacherAttendancePage;