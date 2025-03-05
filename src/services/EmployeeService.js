import axios from "axios";

const BASE_URL = "http://localhost:8080/apis/employees";

export const listofemployees = () => axios.get(BASE_URL + "/getall");

export const createEmployee = (employee) => axios.post(BASE_URL + "/create", employee);

export const updateEmployee = (id, employee) => axios.put(`${BASE_URL}/${id}`, employee);

export const deleteEmployee = async (id) => {
    if (!id) {
        console.error("Error: Employee ID is undefined.");
        return;
    }

    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        console.log(`Employee ${id} deleted successfully.`);
        return response;
    } catch (error) {
        console.error("Error deleting employee:", error);
        throw error;
    }
};

// ✅ Fix: Add getEmployeeById function
export const getEmployeeById = (id) => axios.get(`${BASE_URL}/${id}`);
