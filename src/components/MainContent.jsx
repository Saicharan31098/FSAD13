// components/MainContent.jsx
import React from "react";
import DashboardPage from "./Pages/DashboardPages";
import AdminDashboard from "./Pages/AdminDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentsPage from "./Pages/StudentsPage";
import FacultyPage from "./Pages/FacultyPage";
import CoursesPage from "./Pages/CoursesPage";
import SchedulePage from "./Pages/SchedulePage";
import FinancePage from "./Pages/FinancePage";
import LibraryPage from "./Pages/LibraryPage";
import ReportsPage from "./Pages/ReportsPage";
import SettingsPage from "./Pages/SettingsPage";
import AttendanceRegister from "./Pages/AttendanceRegister";

export default function MainContent({ activePage, user }) {
  // Render role-specific dashboard
  const renderDashboard = () => {
    const role = user?.role?.toLowerCase();
    
    if (role === "admin") {
      return <AdminDashboard user={user} />;
    } else if (role === "teacher") {
      return <TeacherDashboard user={user} />;
    } else if (role === "student") {
      return <StudentDashboard user={user} />;
    }
    return <DashboardPage user={user} />;
  };

  return (
    <div className="main-area">
      {activePage === "dashboard-page" && renderDashboard()}
      {activePage === "students-page" && <StudentsPage />}
      {activePage === "faculty-page" && <FacultyPage />}
      {activePage === "courses-page" && <CoursesPage user={user} />}
      {activePage === "schedule-page" && <SchedulePage user={user} />}
      {activePage === "finance-page" && <FinancePage />}
      {activePage === "library-page" && <LibraryPage />}
      {activePage === "reports-page" && <ReportsPage />}
      {activePage === "settings-page" && <SettingsPage />}
      {activePage === "attendance-page" && <AttendanceRegister />}
    </div>
  );
}
