import React, { useEffect, useState, useCallback } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { listofemployees, deleteEmployee } from "../services/EmployeeService";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setAlertMessage(location.state.message);
      setTimeout(() => setAlertMessage(""), 3000);
    }
    fetchEmployees();
  }, [location.state]);

  const fetchEmployees = async (message = "") => {
    try {
      const response = await listofemployees();
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        setEmployees([]); // Default to an empty array if the response is not an array
      }
      if (message) {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setErrorMessage("An error occurred while fetching employees.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async () => {
    if (!employeeToDelete) return;
    try {
      await deleteEmployee(employeeToDelete);
      fetchEmployees("Employee deleted successfully!"); // Refetch the list after delete
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }, [employeeToDelete]);

  const addNewEmployee = useCallback(() => navigate('/add-employee'), [navigate]);
  const updateEmployee = useCallback((id) => navigate(`/edit-employee/${id}`), [navigate]);

  const handleModalOpen = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEmployeeToDelete(null);
  };

  const filteredEmployees = (Array.isArray(employees) ? employees : []).filter((employee) =>
    employee.id.toString().includes(searchTerm) ||
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Employee Management</h1>

      {alertMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {alertMessage}
          <button type="button" className="btn-close" onClick={() => setAlertMessage("")}></button>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
        </div>
      )}

      <div className="card shadow-lg">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title">List of Employees</h5>
            <div className="d-flex gap-2 align-items-center">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text"><FaSearch /></span>
              </div>
              <button className="btn btn-primary d-flex align-items-center" onClick={addNewEmployee}>
                <FaUserPlus className="me-2" /> Add Employee
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>
                        <button className="btn btn-info btn-sm me-2" onClick={() => updateEmployee(employee.id)}>
                          <FaEdit /> Update
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleModalOpen(employee.id)}>
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this employee?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEmployees;
