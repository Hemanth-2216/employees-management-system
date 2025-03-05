import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Add Navigate
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import AllEmployees from "./components/AllEmployees";
import EmployeeComponent from "./components/EmployeeComponent"; 
import './App.css';

function App() {
  return (
    <div className="container">
      <HeaderComponent />
      <div className="content">
        <Routes>
          {/* Route for the list of all employees */}
          <Route path="/employees" element={<AllEmployees />} />
          {/* Route for adding a new employee */}
          <Route path="/add-employee" element={<EmployeeComponent />} />
          {/* Route for editing an employee */}
          <Route path="/edit-employee/:id" element={<EmployeeComponent />} />
          {/* Route for the root path (redirect to /employees or show a homepage) */}
          <Route path="/" element={<Navigate to="/employees" />} /> {/* Redirect to /employees */}
        </Routes>
      </div>
      <FooterComponent />
    </div>
  );
}

export default App;
