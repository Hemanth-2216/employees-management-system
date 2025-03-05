import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee, getEmployeeById } from '../services/EmployeeService';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope } from 'react-icons/fa';

const EmployeeComponent = () => {
    const { id } = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();  // to get the state passed from navigate()

    const successMessage = location.state?.message;

    useEffect(() => {
        if (id) {
            getEmployeeById(id)
                .then((response) => {
                    const employee = response.data;
                    setFirstName(employee.firstName);
                    setLastName(employee.lastName);
                    setEmail(employee.email);
                })
                .catch(error => {
                    setErrorMessage("Error fetching employee details.");
                    console.error("Error fetching employee details:", error);
                });
        }
    }, [id]);

    const saveEmployee = (e) => {
        e.preventDefault();

        const employee = { firstName, lastName, email };

        if (!firstName || !lastName || !email) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        // Show confirmation dialog before proceeding with Add or Update
        const confirmAction = window.confirm(
            id ? "Are you sure you want to update this employee?" : "Are you sure you want to add this new employee?"
        );

        if (!confirmAction) return;

        if (id) {
            // Update the existing employee
            updateEmployee(id, employee)
                .then(() => {
                    navigate('/employees', { state: { message: "Employee updated successfully!" } });
                })
                .catch(error => {
                    setErrorMessage("Error updating employee.");
                    console.error("Error updating employee:", error);
                });
        } else {
            // Create a new employee
            createEmployee(employee)
                .then(() => {
                    navigate('/employees', { state: { message: "Employee added successfully!" } });
                })
                .catch(error => {
                    setErrorMessage("Error creating employee.");
                    console.error("Error creating employee:", error);
                });
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "url('/download1.jpg') no-repeat center center/cover"
        }}>
            <div className="card shadow-lg p-4 rounded" style={{
                width: '450px',
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)"
            }}>
                <h2 className="text-center text-primary mb-4">
                    {id ? "Update Employee" : "Add Employee"}
                </h2>
                <div className="card-body">
                    {errorMessage && (
                        <div className="alert alert-danger mb-3" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success mb-3" role="alert">
                            {successMessage}
                        </div>
                    )}
                    <form onSubmit={saveEmployee}>
                        {id && (
                            <div className="form-group mb-3">
                                <label className="form-label">Employee ID</label>
                                <input type="text" value={id} className="form-control" disabled />
                            </div>
                        )}

                        <div className="form-group mb-3">
                            <label className="form-label">First Name</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaUser /></span>
                                <input type="text" placeholder="Enter First Name" value={firstName}
                                    className="form-control" onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Last Name</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaUser /></span>
                                <input type="text" placeholder="Enter Last Name" value={lastName}
                                    className="form-control" onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label">Email</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaEnvelope /></span>
                                <input type="email" placeholder="Enter Email" value={email}
                                    className="form-control" onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 shadow-sm">
                            {id ? "Update" : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeComponent;