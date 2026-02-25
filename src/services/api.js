// API service for handling all backend-like operations
// This mock backend uses localStorage to persist data

const API_BASE = "http://localhost:3001/api";

// Track whether we've already notified about backend unreachability to avoid duplicate alerts
let backendUnreachableNotified = false;

function notifyBackendUnreachable(err) {
  console.error('Network request failed:', err?.message || err);
  if (!backendUnreachableNotified) {
    backendUnreachableNotified = true;
    try {
      alert(`Unable to reach backend at ${API_BASE} — using local mock.\nError: ${err?.message || err}`);
    } catch (e) {
      // ignore alert failures (e.g., non-window environments)
    }
  }
}

// Simple network helpers (used by "network-first" duplicate endpoints)
const networkPost = async (path, payload) => {
  const url = `${API_BASE}${path}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return await resp.json();
};

const networkGet = async (path) => {
  const url = `${API_BASE}${path}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return await resp.json();
};

// Initialize default data in localStorage
const initializeData = () => {
  if (!localStorage.getItem("erp_assignments")) {
    localStorage.setItem("erp_assignments", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_student_marks")) {
    localStorage.setItem("erp_student_marks", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_attendance")) {
    localStorage.setItem("erp_attendance", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_courses")) {
    localStorage.setItem("erp_courses", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_announcements")) {
    localStorage.setItem("erp_announcements", JSON.stringify([]));
  }
};

initializeData();

// ============================================
// TEACHER API PATHS
// ============================================

export const TeacherAPI = {
  // Create Assignment
  createAssignment: (assignmentData) => {
    try {
      const assignments = JSON.parse(localStorage.getItem("erp_assignments")) || [];
      const newAssignment = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...assignmentData,
      };
      assignments.push(newAssignment);
      localStorage.setItem("erp_assignments", JSON.stringify(assignments));
      return { success: true, data: newAssignment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first create assignment (tries localhost then falls back)
  createAssignmentNetwork: async (assignmentData) => {
    try {
      const res = await networkPost('/teacher/assignments/create', assignmentData);
      return { success: true, data: res };
    } catch (err) {
      // notify once about localhost error and fall back to local implementation
      notifyBackendUnreachable(err);
      return TeacherAPI.createAssignment(assignmentData);
    }
  },

  // Get All Assignments for a teacher's course
  getAssignments: (courseId) => {
    try {
      const assignments = JSON.parse(localStorage.getItem("erp_assignments")) || [];
      const filtered = assignments.filter((a) => a.courseId === courseId);
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update Assignment
  updateAssignment: (assignmentId, updateData) => {
    try {
      const assignments = JSON.parse(localStorage.getItem("erp_assignments")) || [];
      const index = assignments.findIndex((a) => a.id === assignmentId);
      if (index > -1) {
        assignments[index] = { ...assignments[index], ...updateData };
        localStorage.setItem("erp_assignments", JSON.stringify(assignments));
        return { success: true, data: assignments[index] };
      }
      return { success: false, error: "Assignment not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete Assignment
  deleteAssignment: (assignmentId) => {
    try {
      const assignments = JSON.parse(localStorage.getItem("erp_assignments")) || [];
      const filtered = assignments.filter((a) => a.id !== assignmentId);
      localStorage.setItem("erp_assignments", JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Post Student Marks
  postStudentMarks: (marksData) => {
    try {
      const allMarks = JSON.parse(localStorage.getItem("erp_student_marks")) || [];
      const existingIndex = allMarks.findIndex(
        (m) => m.studentId === marksData.studentId && m.courseId === marksData.courseId && m.type === marksData.type
      );

      if (existingIndex > -1) {
        allMarks[existingIndex] = { ...allMarks[existingIndex], ...marksData, updatedAt: new Date().toISOString() };
      } else {
        allMarks.push({
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...marksData,
        });
      }

      localStorage.setItem("erp_student_marks", JSON.stringify(allMarks));
      return { success: true, data: allMarks[existingIndex > -1 ? existingIndex : allMarks.length - 1] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first post marks
  postStudentMarksNetwork: async (marksData) => {
    try {
      const res = await networkPost('/teacher/marks/post', marksData);
      return { success: true, data: res };
    } catch (err) {
      notifyBackendUnreachable(err);
      return TeacherAPI.postStudentMarks(marksData);
    }
  },

  // Get Student Marks
  getStudentMarks: (courseId, studentId = null) => {
    try {
      const allMarks = JSON.parse(localStorage.getItem("erp_student_marks")) || [];
      let filtered = allMarks.filter((m) => m.courseId === courseId);
      if (studentId) {
        filtered = filtered.filter((m) => m.studentId === studentId);
      }
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark Attendance
  markAttendance: (attendanceData) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      const newAttendance = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...attendanceData,
      };
      allAttendance.push(newAttendance);
      localStorage.setItem("erp_attendance", JSON.stringify(allAttendance));
      return { success: true, data: newAttendance };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first mark attendance
  markAttendanceNetwork: async (attendanceData) => {
    try {
      const res = await networkPost('/teacher/attendance/mark', attendanceData);
      return { success: true, data: res };
    } catch (err) {
      notifyBackendUnreachable(err);
      return TeacherAPI.markAttendance(attendanceData);
    }
  },

  // Get Attendance
  getAttendance: (courseId, studentId = null) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      let filtered = allAttendance.filter((a) => a.courseId === courseId);
      if (studentId) {
        filtered = filtered.filter((a) => a.studentId === studentId);
      }
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark Batch Attendance for a class
  markBatchAttendance: (classAttendanceData) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      const marked = [];
      
      classAttendanceData.forEach((studentAttendance) => {
        const newRecord = {
          id: Date.now().toString() + Math.random(),
          createdAt: new Date().toISOString(),
          ...studentAttendance,
        };
        allAttendance.push(newRecord);
        marked.push(newRecord);
      });
      
      localStorage.setItem("erp_attendance", JSON.stringify(allAttendance));
      return { success: true, data: marked, message: `Attendance marked for ${marked.length} students` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Attendance Summary by Class
  getAttendanceSummary: (courseId, semester = null) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      let filtered = allAttendance.filter((a) => a.courseId === courseId);
      if (semester) {
        filtered = filtered.filter((a) => a.semester === semester);
      }
      
      const byStudent = {};
      filtered.forEach((record) => {
        if (!byStudent[record.studentId]) {
          byStudent[record.studentId] = { present: 0, absent: 0, total: 0 };
        }
        byStudent[record.studentId].total += 1;
        if (record.status === "present") {
          byStudent[record.studentId].present += 1;
        } else {
          byStudent[record.studentId].absent += 1;
        }
      });
      
      // Calculate percentages
      const summary = {};
      Object.keys(byStudent).forEach((studentId) => {
        const stat = byStudent[studentId];
        summary[studentId] = {
          ...stat,
          percentage: ((stat.present / stat.total) * 100).toFixed(2)
        };
      });
      
      return { success: true, data: summary };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create Announcement
  createAnnouncement: (announcementData) => {
    try {
      const announcements = JSON.parse(localStorage.getItem("erp_announcements")) || [];
      const newAnnouncement = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...announcementData,
      };
      announcements.push(newAnnouncement);
      localStorage.setItem("erp_announcements", JSON.stringify(announcements));
      return { success: true, data: newAnnouncement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Announcements
  getAnnouncements: (courseId = null) => {
    try {
      const announcements = JSON.parse(localStorage.getItem("erp_announcements")) || [];
      let filtered = announcements;
      if (courseId) {
        filtered = announcements.filter((a) => a.courseId === courseId);
      }
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// STUDENT API PATHS
// ============================================

export const StudentAPI = {
  // Get Student Results by Semester
  getResultsBySemester: (studentId, semester) => {
    try {
      const allMarks = JSON.parse(localStorage.getItem("erp_student_marks")) || [];
      const results = allMarks.filter((m) => m.studentId === studentId && m.semester === semester);
      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Student CGPA
  getStudentCGPA: (studentId) => {
    try {
      const allMarks = JSON.parse(localStorage.getItem("erp_student_marks")) || [];
      const studentMarks = allMarks.filter((m) => m.studentId === studentId);

      if (studentMarks.length === 0) {
        return { success: true, data: { cgpa: 0, sgpa: 0 } };
      }

      const totalMarks = studentMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
      const cgpa = (totalMarks / studentMarks.length / 25).toFixed(2);

      return { success: true, data: { cgpa: parseFloat(cgpa), totalMarks, courseCount: studentMarks.length } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Student Assignments
  getStudentAssignments: (studentId, courseId = null) => {
    try {
      const assignments = JSON.parse(localStorage.getItem("erp_assignments")) || [];
      let filtered = assignments;
      if (courseId) {
        filtered = assignments.filter((a) => a.courseId === courseId);
      }
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Submit Assignment
  submitAssignment: (submissionData) => {
    try {
      const submissions = JSON.parse(localStorage.getItem("erp_submissions")) || [];
      const newSubmission = {
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: "submitted",
        ...submissionData,
      };
      submissions.push(newSubmission);
      localStorage.setItem("erp_submissions", JSON.stringify(submissions));
      return { success: true, data: newSubmission };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Student Attendance
  getStudentAttendance: (studentId, courseId = null) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      let filtered = allAttendance.filter((a) => a.studentId === studentId);
      if (courseId) {
        filtered = filtered.filter((a) => a.courseId === courseId);
      }
      const presentCount = filtered.filter((a) => a.status === "present").length;
      const absentCount = filtered.filter((a) => a.status === "absent").length;
      const percentage = filtered.length > 0 ? ((presentCount / filtered.length) * 100).toFixed(2) : 0;

      return {
        success: true,
        data: { attendance: filtered, presentCount, absentCount, percentage, totalClasses: filtered.length },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first export schedule (server may return generated file or a URL)
  exportScheduleNetwork: async (studentId, payload = {}) => {
    try {
      const path = `/students/${studentId}/export/schedule`;
      const res = await networkPost(path, payload);
      return { success: true, data: res };
    } catch (err) {
      notifyBackendUnreachable(err);
      return { success: false, error: err?.message || String(err) };
    }
  },

  // Network-first get student attendance
  getStudentAttendanceNetwork: async (studentId, courseId = null) => {
    try {
      const path = courseId ? `/students/${studentId}/attendance?courseId=${courseId}` : `/students/${studentId}/attendance`;
      const res = await networkGet(path);
      return { success: true, data: res };
    } catch (err) {
      console.error('Network getStudentAttendance failed:', err.message);
      alert(`Unable to reach backend at ${API_BASE} — using local mock.\nError: ${err.message}`);
      return StudentAPI.getStudentAttendance(studentId, courseId);
    }
  },

  // Get Student Attendance Summary by Semester
  getAttendanceBySemester: (studentId, semester) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      const filtered = allAttendance.filter((a) => a.studentId === studentId && a.semester === semester);
      const presentCount = filtered.filter((a) => a.status === "present").length;
      const absentCount = filtered.filter((a) => a.status === "absent").length;
      const percentage = filtered.length > 0 ? ((presentCount / filtered.length) * 100).toFixed(2) : 0;

      return {
        success: true,
        data: {
          semester,
          totalClasses: filtered.length,
          presentCount,
          absentCount,
          percentage: parseFloat(percentage),
          attendanceDetails: filtered
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Attendance Statistics by Course
  getAttendanceByCourseSemester: (studentId, courseId, semester) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      const filtered = allAttendance.filter((a) => a.studentId === studentId && a.courseId === courseId && a.semester === semester);
      const presentCount = filtered.filter((a) => a.status === "present").length;
      const absentCount = filtered.filter((a) => a.status === "absent").length;
      const percentage = filtered.length > 0 ? ((presentCount / filtered.length) * 100).toFixed(2) : 0;

      return {
        success: true,
        data: {
          courseId,
          semester,
          totalClasses: filtered.length,
          presentCount,
          absentCount,
          percentage: parseFloat(percentage),
          attendanceLog: filtered
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get All Attendance for Report
  getAttendanceReport: (studentId) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      const studentAttendance = allAttendance.filter((a) => a.studentId === studentId);
      
      // Group by semester
      const bySemester = {};
      studentAttendance.forEach((record) => {
        if (!bySemester[record.semester]) {
          bySemester[record.semester] = [];
        }
        bySemester[record.semester].push(record);
      });

      // Calculate percentages for each semester
      const semesterStats = {};
      Object.keys(bySemester).forEach((semester) => {
        const records = bySemester[semester];
        const presentCount = records.filter((a) => a.status === "present").length;
        const percentage = records.length > 0 ? ((presentCount / records.length) * 100).toFixed(2) : 0;
        semesterStats[semester] = {
          totalClasses: records.length,
          present: presentCount,
          absent: records.length - presentCount,
          percentage: parseFloat(percentage),
          records
        };
      });

      return { success: true, data: semesterStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Announcements
  getAnnouncements: () => {
    try {
      const announcements = JSON.parse(localStorage.getItem("erp_announcements")) || [];
      return { success: true, data: announcements };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// ADMIN API PATHS
// ============================================

export const AdminAPI = {
  // Get All Students
  getAllStudents: () => {
    try {
      const students = JSON.parse(localStorage.getItem("erp_students")) || [];
      return { success: true, data: students };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add Student
  addStudent: (studentData) => {
    try {
      const students = JSON.parse(localStorage.getItem("erp_students")) || [];
      const newStudent = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...studentData,
      };
      students.push(newStudent);
      localStorage.setItem("erp_students", JSON.stringify(students));
      return { success: true, data: newStudent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update Student
  updateStudent: (studentId, updateData) => {
    try {
      const students = JSON.parse(localStorage.getItem("erp_students")) || [];
      const index = students.findIndex((s) => s.id === studentId);
      if (index > -1) {
        students[index] = { ...students[index], ...updateData };
        localStorage.setItem("erp_students", JSON.stringify(students));
        return { success: true, data: students[index] };
      }
      return { success: false, error: "Student not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete Student
  deleteStudent: (studentId) => {
    try {
      const students = JSON.parse(localStorage.getItem("erp_students")) || [];
      const filtered = students.filter((s) => s.id !== studentId);
      localStorage.setItem("erp_students", JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get All Teachers
  getAllTeachers: () => {
    try {
      const teachers = JSON.parse(localStorage.getItem("erp_teachers")) || [];
      return { success: true, data: teachers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add Teacher
  addTeacher: (teacherData) => {
    try {
      const teachers = JSON.parse(localStorage.getItem("erp_teachers")) || [];
      const newTeacher = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...teacherData,
      };
      teachers.push(newTeacher);
      localStorage.setItem("erp_teachers", JSON.stringify(teachers));
      return { success: true, data: newTeacher };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get All Courses
  getAllCourses: () => {
    try {
      const courses = JSON.parse(localStorage.getItem("erp_courses")) || [];
      return { success: true, data: courses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create Course
  createCourse: (courseData) => {
    try {
      const courses = JSON.parse(localStorage.getItem("erp_courses")) || [];
      const newCourse = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...courseData,
      };
      courses.push(newCourse);
      localStorage.setItem("erp_courses", JSON.stringify(courses));
      return { success: true, data: newCourse };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first create course
  createCourseNetwork: async (courseData) => {
    try {
      const res = await networkPost('/admin/courses/create', courseData);
      return { success: true, data: res };
    } catch (err) {
      notifyBackendUnreachable(err);
      return AdminAPI.createCourse(courseData);
    }
  },

  // Update Course (local)
  updateCourse: (courseId, updateData) => {
    try {
      const courses = JSON.parse(localStorage.getItem('erp_courses')) || [];
      const index = courses.findIndex((c) => (c.id === courseId || c.code === courseId));
      if (index > -1) {
        courses[index] = { ...courses[index], ...updateData, updatedAt: new Date().toISOString() };
        localStorage.setItem('erp_courses', JSON.stringify(courses));
        return { success: true, data: courses[index] };
      }
      return { success: false, error: 'Course not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first update course
  updateCourseNetwork: async (courseId, updateData) => {
    try {
      const res = await networkPost('/admin/courses/update', { id: courseId, ...updateData });
      return { success: true, data: res };
    } catch (err) {
      notifyBackendUnreachable(err);
      return AdminAPI.updateCourse(courseId, updateData);
    }
  },

  // Delete Course (local)
  deleteCourse: (courseId) => {
    try {
      const courses = JSON.parse(localStorage.getItem('erp_courses')) || [];
      const filtered = courses.filter((c) => !(c.id === courseId || c.code === courseId));
      localStorage.setItem('erp_courses', JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first delete course
  deleteCourseNetwork: async (courseId) => {
    try {
      const res = await networkPost('/admin/courses/delete', { id: courseId });
      return { success: true, data: res };
    } catch (err) {
      notifyBackendUnreachable(err);
      return AdminAPI.deleteCourse(courseId);
    }
  },

  // Get System Statistics
  getSystemStats: () => {
    try {
      const students = JSON.parse(localStorage.getItem("erp_students")) || [];
      const teachers = JSON.parse(localStorage.getItem("erp_teachers")) || [];
      const courses = JSON.parse(localStorage.getItem("erp_courses")) || [];

      return {
        success: true,
        data: {
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalCourses: courses.length,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get System Health
  getSystemHealth: () => {
    try {
      return {
        success: true,
        data: {
          serverStatus: "Online",
          databaseStatus: "Healthy",
          uptime: "99.8%",
          users: "3,210",
          lastChecked: new Date().toISOString(),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// COMMON API PATHS
// ============================================

export const CommonAPI = {
  // Get User Profile
  getUserProfile: (userId) => {
    try {
      const user = {
        id: userId,
        username: localStorage.getItem("uniERPUser") ? JSON.parse(localStorage.getItem("uniERPUser")).username : "User",
        email: `${userId}@university.edu`,
        role: JSON.parse(localStorage.getItem("uniERPUser")).role || "student",
      };
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Dashboard Data
  getDashboardData: (role, userId) => {
    try {
      if (role === "admin") {
        return AdminAPI.getSystemStats();
      } else if (role === "teacher") {
        return { success: true, data: { courses: 3, students: 124 } };
      } else {
        return { success: true, data: { enrolledCourses: 5, cgpa: 3.48 } };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search
  search: (query, type = "all") => {
    try {
      const results = {};

      if (type === "all" || type === "students") {
        const students = JSON.parse(localStorage.getItem("erp_students")) || [];
        results.students = students.filter((s) => s.name?.toLowerCase().includes(query.toLowerCase()));
      }

      if (type === "all" || type === "teachers") {
        const teachers = JSON.parse(localStorage.getItem("erp_teachers")) || [];
        results.teachers = teachers.filter((t) => t.name?.toLowerCase().includes(query.toLowerCase()));
      }

      if (type === "all" || type === "courses") {
        const courses = JSON.parse(localStorage.getItem("erp_courses")) || [];
        results.courses = courses.filter((c) => c.name?.toLowerCase().includes(query.toLowerCase()));
      }

      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // -----------------------------
  // Duplicate Attendance endpoints (wrapper aliases)
  // These provide alternate "backend" entry points that delegate to StudentAPI
  // -----------------------------
  // Get Attendance Report (duplicate path)
  getAttendanceReport: (studentId) => {
    try {
      return StudentAPI.getAttendanceReport(studentId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Attendance By Semester (duplicate path)
  getAttendanceBySemester: (studentId, semester) => {
    try {
      return StudentAPI.getAttendanceBySemester(studentId, semester);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Attendance By Course & Semester (duplicate path)
  getAttendanceByCourseSemester: (studentId, courseId, semester) => {
    try {
      return StudentAPI.getAttendanceByCourseSemester(studentId, courseId, semester);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default {
  TeacherAPI,
  StudentAPI,
  AdminAPI,
  CommonAPI,
};
