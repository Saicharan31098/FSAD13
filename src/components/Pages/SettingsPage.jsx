import React, { useState } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    institutionName: 'UniERP University',
    academicYear: '2023-2024',
    gradeScale: 'Percentage (0-100%)',
    dateFormat: 'MM/DD/YYYY'
  });

  const [users] = useState([
    { username: 'admin', fullName: 'System Administrator', role: 'Administrator', lastLogin: '2023-10-15 09:42', status: 'Active' },
    { username: 'jsmith', fullName: 'John Smith', role: 'Faculty', lastLogin: '2023-10-14 14:20', status: 'Active' },
    { username: 'ljohnson', fullName: 'Lisa Johnson', role: 'Registrar', lastLogin: '2023-10-15 08:15', status: 'Active' }
  ]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div id="settings-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">⚙️ System Settings</h1>
        <p className="page-subtitle">Configure system preferences and user management</p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">General Settings</h2>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="institution-name">Institution Name</label>
            <input 
              type="text" 
              id="institution-name" 
              className="form-control" 
              value={settings.institutionName}
              onChange={(e) => handleSettingChange('institutionName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="academic-year">Academic Year</label>
            <select 
              id="academic-year" 
              className="form-control"
              value={settings.academicYear}
              onChange={(e) => handleSettingChange('academicYear', e.target.value)}
            >
              <option>2023-2024</option>
              <option>2022-2023</option>
              <option>2021-2022</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="grade-scale">Grade Scale</label>
            <select 
              id="grade-scale" 
              className="form-control"
              value={settings.gradeScale}
              onChange={(e) => handleSettingChange('gradeScale', e.target.value)}
            >
              <option>Percentage (0-100%)</option>
              <option>Letter Grade (A-F)</option>
              <option>GPA (0-4.0)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="date-format">Date Format</label>
            <select 
              id="date-format" 
              className="form-control"
              value={settings.dateFormat}
              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" style={{marginTop: '15px'}} onClick={handleSaveSettings}>
          <i className="fas fa-save"></i> Save Settings
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">User Management</h2>
          <button className="btn btn-primary" id="add-user-btn"><i className="fas fa-plus"></i> Add New User</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="user-table-body">
            {users.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.fullName}</td>
                <td>{user.role}</td>
                <td>{user.lastLogin}</td>
                <td><span className="badge badge-success">{user.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-outline"><i className="fas fa-edit"></i></button>
                    <button className="btn btn-danger"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsPage;