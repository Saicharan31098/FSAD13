/**
 * API PATHS DOCUMENTATION
 * 
 * This document describes all available API paths that work like a backend system.
 * Even though it's built with localStorage for now, it follows RESTful conventions.
 */

export const API_DOCUMENTATION = {
  // ============================================
  // TEACHER API PATHS
  // ============================================
  TEACHER: {
    ASSIGNMENTS: {
      CREATE: {
        method: "POST",
        path: "/api/teacher/assignments/create",
        description: "Create a new assignment",
        params: {
          courseId: "string - Course ID",
          title: "string - Assignment title",
          description: "string - Assignment description",
          dueDate: "ISO string - Due date and time",
          totalMarks: "number - Total marks for assignment",
        },
        example: "TeacherAPI.createAssignment({ courseId: 'CS101', ... })",
      },
      GET: {
        method: "GET",
        path: "/api/teacher/assignments/:courseId",
        description: "Get all assignments for a course",
        params: {
          courseId: "string - Course ID",
        },
        example: "TeacherAPI.getAssignments('CS101')",
      },
      UPDATE: {
        method: "PUT",
        path: "/api/teacher/assignments/:assignmentId",
        description: "Update an existing assignment",
        params: {
          assignmentId: "string - Assignment ID",
          updateData: "object - Fields to update",
        },
        example: "TeacherAPI.updateAssignment('ASSIGN001', { title: 'New Title' })",
      },
      DELETE: {
        method: "DELETE",
        path: "/api/teacher/assignments/:assignmentId",
        description: "Delete an assignment",
        params: {
          assignmentId: "string - Assignment ID",
        },
        example: "TeacherAPI.deleteAssignment('ASSIGN001')",
      },
    },
    MARKS: {
      POST: {
        method: "POST",
        path: "/api/teacher/marks/post",
        description: "Post marks for a student",
        params: {
          courseId: "string - Course ID",
          studentId: "string - Student ID",
          type: "string - Type (assignment, quiz, midterm, final, project)",
          marks: "number - Marks obtained",
          totalMarks: "number - Total marks",
          semester: "number - Semester number",
          description: "string - Remarks/feedback",
        },
        example: "TeacherAPI.postStudentMarks({ courseId: 'CS101', studentId: 'STU001', ... })",
      },
      GET: {
        method: "GET",
        path: "/api/teacher/marks/:courseId",
        description: "Get marks for a course or specific student",
        params: {
          courseId: "string - Course ID",
          studentId: "string (optional) - Specific student ID",
        },
        example: "TeacherAPI.getStudentMarks('CS101', 'STU001')",
      },
    },
    ATTENDANCE: {
      MARK: {
        method: "POST",
        path: "/api/teacher/attendance/mark",
        description: "Mark attendance for students",
        params: {
          courseId: "string - Course ID",
          studentId: "string - Student ID",
          date: "ISO string - Date of class",
          status: "string - present, absent, or late",
        },
        example: "TeacherAPI.markAttendance({ courseId: 'CS101', ... })",
      },
      GET: {
        method: "GET",
        path: "/api/teacher/attendance/:courseId",
        description: "Get attendance records",
        params: {
          courseId: "string - Course ID",
          studentId: "string (optional) - Specific student",
        },
        example: "TeacherAPI.getAttendance('CS101')",
      },
    },
    ANNOUNCEMENTS: {
      CREATE: {
        method: "POST",
        path: "/api/teacher/announcements/create",
        description: "Create announcement for students",
        params: {
          courseId: "string - Course ID",
          title: "string - Announcement title",
          description: "string - Announcement details",
          priority: "string - low, medium, high",
        },
        example: "TeacherAPI.createAnnouncement({ ... })",
      },
      GET: {
        method: "GET",
        path: "/api/teacher/announcements/:courseId",
        description: "Get announcements",
        example: "TeacherAPI.getAnnouncements('CS101')",
      },
    },
  },

  // ============================================
  // STUDENT API PATHS
  // ============================================
  STUDENT: {
    RESULTS: {
      BY_SEMESTER: {
        method: "GET",
        path: "/api/student/results/:semester",
        description: "Get results for a specific semester",
        params: {
          studentId: "string - Student ID",
          semester: "number - Semester number",
        },
        example: "StudentAPI.getResultsBySemester('STU001', 1)",
      },
      CGPA: {
        method: "GET",
        path: "/api/student/cgpa",
        description: "Get student CGPA and SGPA",
        params: {
          studentId: "string - Student ID",
        },
        example: "StudentAPI.getStudentCGPA('STU001')",
      },
    },
    ASSIGNMENTS: {
      GET: {
        method: "GET",
        path: "/api/student/assignments",
        description: "Get assigned assignments",
        params: {
          studentId: "string - Student ID",
          courseId: "string (optional) - Filter by course",
        },
        example: "StudentAPI.getStudentAssignments('STU001', 'CS101')",
      },
      SUBMIT: {
        method: "POST",
        path: "/api/student/assignments/submit",
        description: "Submit an assignment",
        params: {
          assignmentId: "string - Assignment ID",
          courseId: "string - Course ID",
          studentId: "string - Student ID",
          filePath: "string - File path or URL",
          remarks: "string - Submission remarks",
        },
        example: "StudentAPI.submitAssignment({ ... })",
      },
    },
    ATTENDANCE: {
      GET: {
        method: "GET",
        path: "/api/student/attendance",
        description: "Get student attendance",
        params: {
          studentId: "string - Student ID",
          courseId: "string (optional) - Filter by course",
        },
        example: "StudentAPI.getStudentAttendance('STU001', 'CS101')",
      },
    },
    ANNOUNCEMENTS: {
      GET: {
        method: "GET",
        path: "/api/student/announcements",
        description: "Get announcements",
        example: "StudentAPI.getAnnouncements()",
      },
    },
  },

  // ============================================
  // ADMIN API PATHS
  // ============================================
  ADMIN: {
    STUDENTS: {
      GET_ALL: {
        method: "GET",
        path: "/api/admin/students",
        description: "Get all students",
        example: "AdminAPI.getAllStudents()",
      },
      ADD: {
        method: "POST",
        path: "/api/admin/students/add",
        description: "Add a new student",
        params: {
          name: "string - Student name",
          email: "string - Email address",
          rollNumber: "string - Roll number",
          enrollmentDate: "ISO string - Enrollment date",
        },
        example: "AdminAPI.addStudent({ name: 'John Doe', ... })",
      },
      UPDATE: {
        method: "PUT",
        path: "/api/admin/students/:studentId",
        description: "Update student information",
        params: {
          studentId: "string - Student ID",
          updateData: "object - Fields to update",
        },
        example: "AdminAPI.updateStudent('STU001', { status: 'inactive' })",
      },
      DELETE: {
        method: "DELETE",
        path: "/api/admin/students/:studentId",
        description: "Delete a student",
        example: "AdminAPI.deleteStudent('STU001')",
      },
    },
    TEACHERS: {
      GET_ALL: {
        method: "GET",
        path: "/api/admin/teachers",
        description: "Get all teachers",
        example: "AdminAPI.getAllTeachers()",
      },
      ADD: {
        method: "POST",
        path: "/api/admin/teachers/add",
        description: "Add a new teacher",
        params: {
          name: "string - Teacher name",
          email: "string - Email address",
          department: "string - Department",
          qualification: "string - Qualification",
        },
        example: "AdminAPI.addTeacher({ name: 'Dr. Jane Smith', ... })",
      },
    },
    COURSES: {
      GET_ALL: {
        method: "GET",
        path: "/api/admin/courses",
        description: "Get all courses",
        example: "AdminAPI.getAllCourses()",
      },
      CREATE: {
        method: "POST",
        path: "/api/admin/courses/create",
        description: "Create a new course",
        params: {
          code: "string - Course code",
          name: "string - Course name",
          credits: "number - Credit hours",
          semester: "number - Semester",
          instructorId: "string - Instructor ID",
        },
        example: "AdminAPI.createCourse({ code: 'CS101', ... })",
      },
    },
    SYSTEM: {
      STATS: {
        method: "GET",
        path: "/api/admin/system/stats",
        description: "Get system statistics",
        example: "AdminAPI.getSystemStats()",
      },
      HEALTH: {
        method: "GET",
        path: "/api/admin/system/health",
        description: "Check system health",
        example: "AdminAPI.getSystemHealth()",
      },
    },
  },

  // ============================================
  // COMMON API PATHS (All Roles)
  // ============================================
  COMMON: {
    PROFILE: {
      GET: {
        method: "GET",
        path: "/api/user/profile/:userId",
        description: "Get user profile",
        example: "CommonAPI.getUserProfile('STU001')",
      },
    },
    DASHBOARD: {
      GET: {
        method: "GET",
        path: "/api/dashboard",
        description: "Get dashboard data (role-specific)",
        params: {
          role: "string - admin, teacher, or student",
          userId: "string - User ID",
        },
        example: "CommonAPI.getDashboardData('teacher', 'TEACH001')",
      },
    },
    SEARCH: {
      GET: {
        method: "GET",
        path: "/api/search",
        description: "Search across system",
        params: {
          query: "string - Search query",
          type: "string - students, teachers, courses, or all",
        },
        example: "CommonAPI.search('john', 'students')",
      },
    },
  },
};

export default API_DOCUMENTATION;
