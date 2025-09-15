import React, { useState, useEffect } from 'react';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await UserService.getAllUsers();
                if (response.data.success) {
                    const allUsers = response.data.data.users;
                    const employeeUsers = allUsers.filter(user => user.role === 'employee');
                    setEmployees(employeeUsers);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                toast.error("Failed to fetch employees");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Employees</h4>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <p>Loading employees...</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.map(employee => (
                                                <tr key={employee.id}>
                                                    <td>{employee.firstName} {employee.lastName}</td>
                                                    <td>{employee.email}</td>
                                                    <td>{employee.role}</td>
                                                    <td>
                                                        <span className={`badge ${employee.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                            {employee.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Employees;
