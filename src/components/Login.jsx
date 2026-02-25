// components/Login.jsx
import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");

  const roles = [
    {
      value: "student",
      label: "Student",
      icon: "fa-solid fa-user-graduate",
      description: "Access your courses, grades, attendance, and academic records"
    },
    {
      value: "teacher",
      label: "Teacher",
      icon: "fa-solid fa-chalkboard-user",
      description: "Manage classes, track student progress, and assign grades"
    },
    {
      value: "admin",
      label: "Administrator",
      icon: "fa-solid fa-shield-halved",
      description: "System administration, user management, and system configuration"
    }
  ];

  function generateCaptcha() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    (async () => {
      if (inputCaptcha !== captcha) {
        alert("Incorrect CAPTCHA");
        return;
      }

      const username = e.target.username.value;
      // Disallow emails in the username field to prevent confusion
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(username)) {
        alert("Please enter a username, not an email address.");
        return;
      }
      const password = e.target.password.value;
      const role = e.target.role ? e.target.role.value : "student";

      const users = JSON.parse(localStorage.getItem("edu_users")) || {};
      const saved = users[username];
      if (!saved) {
        alert("Wrong credentials: user does not exist");
        return;
      }

      const hashed = await hashPassword(password);
      if (saved.password !== hashed) {
        alert("Wrong credentials: incorrect password");
        return;
      }

      if (saved.role !== role) {
        alert(`Wrong credentials: Your registered role is '${saved.role}', but you selected '${role}'. Please select the correct role to login.`);
        return;
      }

      // include stored email when logging in (always use registered role)
      onLogin({ username, role: saved.role, email: saved.email });
    })();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    (async () => {
      const username = e.target.reg_username.value;
      // Disallow emails when choosing a username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(username)) {
        alert("Usernames cannot be email addresses. Please choose a username.");
        return;
      }
      const password = e.target.reg_password.value;
      const role = e.target.reg_role.value;

      if (!username || !password) {
        alert("Please provide username and password");
        return;
      }

      const users = JSON.parse(localStorage.getItem("edu_users")) || {};
      if (users[username]) {
        alert("Username already exists. Choose a different username.");
        return;
      }

      // Create a default institutional email from username
      const defaultEmail = `${username}@university.edu`;

      const hashed = await hashPassword(password);
      users[username] = { username, role, password: hashed, email: defaultEmail };
      localStorage.setItem("edu_users", JSON.stringify(users));

      // Auto-login after registration
      onLogin({ username, role, email: defaultEmail });
    })();
  };

  // Hash password using SubtleCrypto (SHA-256) and return hex string
  async function hashPassword(password) {
    try {
      const enc = new TextEncoder();
      const data = enc.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (err) {
      // Fallback: return plain password (not recommended)
      return password;
    }
  }

  return (
    <div className="login-screen">

      <div className="login-card">

        {/* TOP HEADER */}
        <div className="login-card-header">
          <i className="fa-solid fa-graduation-cap login-logo-icon"></i>
          <h2>EduERP {showSignup ? "Sign Up" : "Login"}</h2>
          <p>{showSignup ? "Create your account to get started" : "Enter your credentials to access the system"}</p>
        </div>

        {/* FORM (login or signup) */}
        {!showSignup ? (
          <form onSubmit={handleSubmit} className="login-form">

            <label className="input-label">Username</label>
            <div className="input-box">
              <input type="text" name="username" placeholder="Enter your username" required />
              <i className="fa-solid fa-user input-icon"></i>
            </div>

            <label className="input-label">Password</label>
            <div className="input-box">
              <input type="password" name="password" placeholder="Enter your password" required />
              <i className="fa-solid fa-lock input-icon"></i>
            </div>

            <label className="input-label">Login as</label>
            <div className="input-box">
              <select name="role" className="captcha-input" defaultValue="student">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <label className="input-label">Enter CAPTCHA</label>
            <div className="captcha-row">
              <div className="captcha-box">{captcha}</div>
              <button type="button" className="captcha-refresh" onClick={refreshCaptcha}>
                <i className="fa-solid fa-rotate-right"></i>
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter the CAPTCHA code"
              className="captcha-input"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
              required
            />

            <button className="login-btn">Login</button>

            <div className="login-footer">
              Forgot your <a href="#">username</a> or <a href="#">password</a>? &nbsp; 
              <span style={{ marginLeft: 8 }}>Don't have an account? <a href="#" onClick={(ev) => { ev.preventDefault(); setShowSignup(true); setSelectedRole("student"); }}>Create account</a></span>
            </div>

          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <label className="input-label">Username</label>
            <div className="input-box">
              <input type="text" name="reg_username" placeholder="Choose a username" required />
              <i className="fa-solid fa-user input-icon"></i>
            </div>
            
            <label className="input-label">Password</label>
            <div className="input-box">
              <input type="password" name="reg_password" placeholder="Choose a password" required />
              <i className="fa-solid fa-lock input-icon"></i>
            </div>
            
            <label className="input-label">Select Your Role</label>
            <div className="role-selection">
              {roles.map((role) => (
                <div
                  key={role.value}
                  className={`role-card ${selectedRole === role.value ? "active" : ""}`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <i className={role.icon}></i>
                  <h4>{role.label}</h4>
                  <p>{role.description}</p>
                  {selectedRole === role.value && <div className="role-checkmark"><i className="fa-solid fa-check"></i></div>}
                </div>
              ))}
            </div>
            <input type="hidden" name="reg_role" value={selectedRole} />

            <button className="login-btn" style={{ marginTop: "20px" }}>Create Account</button>

            <div className="login-footer">
              Already have an account? <a href="#" onClick={(ev) => { ev.preventDefault(); setShowSignup(false); }}>Sign in</a>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
