import React, { useState } from 'react';
import { StudentAPI } from '../../services/api';

const SchedulePage = ({ user }) => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedMonth, setSelectedMonth] = useState('October');

  const scheduleData = [
    { time: '8:00 - 9:30', events: [
      { day: 'Monday', course: 'MATH101', room: 'Room 201', instructor: 'Dr. Smith' },
      { day: 'Tuesday', course: 'PHYS201', room: 'Lab 3', instructor: 'Dr. Johnson' },
      { day: 'Wednesday', course: 'MATH101', room: 'Room 201', instructor: 'Dr. Smith' },
      { day: 'Thursday', course: 'PHYS201', room: 'Lab 3', instructor: 'Dr. Johnson' },
      { day: 'Friday', course: 'MATH101', room: 'Room 201', instructor: 'Dr. Smith' }
    ]},
    { time: '9:45 - 11:15', events: [
      { day: 'Monday', course: 'COMP301', room: 'Lab 5', instructor: 'Prof. White' },
      { day: 'Tuesday', course: 'ENGL101', room: 'Room 105', instructor: 'Dr. Brown' },
      { day: 'Wednesday', course: 'COMP301', room: 'Lab 5', instructor: 'Prof. White' },
      { day: 'Thursday', course: 'ENGL101', room: 'Room 105', instructor: 'Dr. Brown' },
      { day: 'Friday', course: 'COMP301', room: 'Lab 5', instructor: 'Prof. White' }
    ]},
    { time: '11:30 - 1:00', events: [
      { day: 'Monday', course: 'HIST202', room: 'Room 301', instructor: 'Prof. Davis' },
      { day: 'Tuesday', course: 'CHEM102', room: 'Lab 2', instructor: 'Dr. Miller' },
      { day: 'Wednesday', course: 'HIST202', room: 'Room 301', instructor: 'Prof. Davis' },
      { day: 'Thursday', course: 'CHEM102', room: 'Lab 2', instructor: 'Dr. Miller' },
      { day: 'Friday', course: 'HIST202', room: 'Room 301', instructor: 'Prof. Davis' }
    ]},
    { time: '1:00 - 2:30', events: [
      { day: 'Monday', course: 'PHYS201', room: 'Lab 3', instructor: 'Dr. Johnson' },
      { day: 'Tuesday', course: 'MATH101', room: 'Room 201', instructor: 'Dr. Smith' },
      { day: 'Wednesday', course: 'PHYS201', room: 'Lab 3', instructor: 'Dr. Johnson' },
      { day: 'Thursday', course: 'MATH101', room: 'Room 201', instructor: 'Dr. Smith' },
      { day: 'Friday', course: 'PHYS201', room: 'Lab 3', instructor: 'Dr. Johnson' }
    ]}
  ];

  const calendarData = [
    { date: 1, events: ['Faculty Meeting - 10:00 AM'], type: 'meeting' },
    { date: 5, events: ['Science Fair - All Day'], type: 'event' },
    { date: 10, events: ['Mid-term Exams Begin'], type: 'exam' },
    { date: 15, events: ['Tuition Due Date'], type: 'deadline' },
    { date: 20, events: ['Parent-Teacher Conference'], type: 'event' },
    { date: 25, events: ['Faculty Development Workshop'], type: 'meeting' },
    { date: 31, events: ['Halloween - No Classes'], type: 'holiday' }
  ];

  const renderCalendar = () => {
    let calendarHTML = [];
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      let weekDays = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < 1) {
          weekDays.push(<td key={`empty-${day}`} className="empty-day"></td>);
        } else if (dayCounter > 31) {
          weekDays.push(<td key={`empty-end-${day}`} className="empty-day"></td>);
        } else {
          const dayEvents = calendarData.find(d => d.date === dayCounter);
          const isToday = dayCounter === 15;
          
          weekDays.push(
            <td key={`day-${dayCounter}`} className={`calendar-cell ${isToday ? 'today' : ''} ${dayEvents ? 'has-events' : ''}`}>
              <div className="calendar-day-number">{dayCounter}</div>
              {dayEvents && dayEvents.events.map((event, index) => (
                <div key={`event-${dayCounter}-${index}`} className={`calendar-event event-${dayEvents.type}`}>
                  <i className="fa-solid fa-circle" style={{ marginRight: '4px', fontSize: '6px' }}></i>
                  <span>{event}</span>
                </div>
              ))}
            </td>
          );
          dayCounter++;
        }
      }
      calendarHTML.push(<tr key={`week-${week}`}>{weekDays}</tr>);
    }

    return calendarHTML;
  };

  const getCourseColor = (course) => {
    const colors = {
      'MATH101': '#FF6B6B',
      'PHYS201': '#4ECDC4',
      'COMP301': '#45B7D1',
      'ENGL101': '#FFA07A',
      'HIST202': '#98D8C8',
      'CHEM102': '#F7DC6F'
    };
    return colors[course] || '#4F46E5';
  };

  const handleExport = async () => {
    if (!user || !user.username) {
      alert('Please log in to export your schedule.');
      return;
    }

    // Try network-first export
    try {
      const payload = { scheduleData, calendarData };
      const res = await StudentAPI.exportScheduleNetwork(user.username, payload);
      if (res && res.success && res.data) {
        // If backend returned file content or URL, try to use it
        if (res.data.fileContent) {
          const blob = new Blob([res.data.fileContent], { type: res.data.mimeType || 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${user.username}-schedule.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          return;
        }
        if (res.data.fileUrl) {
          window.open(res.data.fileUrl, '_blank');
          return;
        }
      }
    } catch (err) {
      // continue to local export fallback
    }

    // Local fallback: generate CSV from scheduleData
    try {
      const rows = [['Time', 'Day', 'Course', 'Room', 'Instructor']];
      scheduleData.forEach(slot => {
        slot.events.forEach(ev => {
          rows.push([slot.time, ev.day, ev.course, ev.room, ev.instructor]);
        });
      });
      const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.username}-schedule.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Schedule exported (local CSV).');
    } catch (e) {
      alert('Export failed: ' + (e?.message || e));
    }
  };

  return (
    <div className="schedule-page">
      {/* Header */}
      <div className="schedule-header">
        <div>
          <h1 className="page-title">
            <i className="fa-solid fa-calendar-days"></i> Schedule Management
          </h1>
          <p className="page-subtitle">View and manage class schedules, rooms, and timetables</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="schedule-stats">
        <div className="stat-item">
          <i className="fa-solid fa-clock"></i>
          <div>
            <h4>Classes Per Week</h4>
            <p>15 Classes</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fa-solid fa-door-open"></i>
          <div>
            <h4>Rooms Assigned</h4>
            <p>8 Rooms</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fa-solid fa-users"></i>
          <div>
            <h4>Total Students</h4>
            <p>542 Students</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fa-solid fa-person-chalkboard"></i>
          <div>
            <h4>Faculty Members</h4>
            <p>12 Instructors</p>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Card */}
      <div className="schedule-card">
        <div className="schedule-card-header">
          <div>
            <h2>
              <i className="fa-solid fa-table"></i> Weekly Timetable
            </h2>
            <p>Week of October 16 - 20, 2023</p>
          </div>
          <button className="btn-export" onClick={() => handleExport()}>
            <i className="fa-solid fa-download"></i> Export Schedule
          </button>
        </div>

        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="time-column">
                  <i className="fa-solid fa-hourglass-end"></i> Time Slot
                </th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((slot, idx) => (
                <tr key={idx} className="schedule-row">
                  <td className="time-slot">
                    <div className="time-badge">{slot.time}</div>
                  </td>
                  {slot.events.map((event, eventIdx) => {
                    const bgColor = getCourseColor(event.course);
                    return (
                      <td key={eventIdx} className="course-cell">
                        <div className="course-card" style={{ borderLeftColor: bgColor }}>
                          <div className="course-code">{event.course}</div>
                          <div className="course-room">
                            <i className="fa-solid fa-location-dot"></i> {event.room}
                          </div>
                          <div className="course-instructor">
                            <i className="fa-solid fa-user-tie"></i> {event.instructor}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <small>Last updated: Today at 2:30 PM</small>
          {user?.role?.toLowerCase() !== 'student' && (
            <button className="btn-edit">
              <i className="fa-solid fa-pen"></i> Edit Schedule
            </button>
          )}
        </div>
      </div>

      {/* Calendar Card */}
      <div className="schedule-card">
        <div className="schedule-card-header">
          <div>
            <h2>
              <i className="fa-solid fa-calendar-alt"></i> Academic Calendar
            </h2>
            <p>October 2023</p>
          </div>
          <div className="legend">
            <span><i className="fa-circle" style={{color: '#FF6B6B'}}></i> Exams</span>
            <span><i className="fa-circle" style={{color: '#FFA07A'}}></i> Events</span>
            <span><i className="fa-circle" style={{color: '#F7DC6F'}}></i> Deadline</span>
          </div>
        </div>

        <div className="calendar-wrapper">
          <table className="calendar-table">
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {renderCalendar()}
            </tbody>
          </table>
        </div>

        <div className="calendar-footer">
          <button className="btn-prev">
            <i className="fa-solid fa-chevron-left"></i> Previous
          </button>
          <span className="current-month">October 2023</span>
          <button className="btn-next">
            Next <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;