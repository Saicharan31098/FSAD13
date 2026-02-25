// App.jsx
import React, { useState, useEffect } from "react";

import Login from "./components/Login";
import Layout from "./components/Pages/Layout";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ active page state for sidebar navigation
  const [activePage, setActivePage] = useState("dashboard-page");

  useEffect(() => {
    const savedUser = localStorage.getItem("uniERPUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userOrName) => {
    let username = typeof userOrName === "string" ? userOrName : userOrName?.username;
    let role = typeof userOrName === "object" && userOrName?.role ? userOrName.role : "student";
    let email = typeof userOrName === "object" && userOrName?.email ? userOrName.email : null;

    if (!username) return;

    // If no email provided, generate a default institutional email from username
    if (!email) email = `${username}@university.edu`;

    const userData = {
      username,
      role,
      email,
      avatar: username.substring(0, 2).toUpperCase(),
    };

    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("uniERPUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("uniERPUser");
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Layout
          user={user}
          onLogout={handleLogout}
          activePage={activePage}
          setActivePage={setActivePage}
        />
      )}
    </div>
  );
}

export default App;
