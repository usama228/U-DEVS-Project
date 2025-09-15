import React, { useState, useEffect } from 'react';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';
import { getUserDetails } from '../../services/AuthService';
import { USER_ROLES } from '../../utils/rolePermissions';

const Interns = () => {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = getUserDetails();

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                let internUsers = [];

                if (currentUser.role === USER_ROLES.ADMIN) {
                    const response = await UserService.getAllUsers();
                    if (response.data.success) {
                        const allUsers = response.data.data.users;
                        const filteredInterns = allUsers.filter(user => user.role === 'internee');

                        internUsers = filteredInterns.map(intern => {
                            const teamLead = allUsers.find(lead => lead.id === intern.teamLeadId);
                            return {
                                ...intern,
                                teamLeadName: teamLead ? `${teamLead.firstName} ${teamLead.lastName}` : 'N/A'
                            };
                        });
                    }
                } else if (currentUser.role === USER_ROLES.TEAM_LEAD) {
                    const response = await UserService.getInternees(currentUser.id);
                    if (response.data.success) {
                        const myInterns = response.data.data.users;
                        const teamLeadName = `${currentUser.firstName} ${currentUser.lastName}`;
                        internUsers = myInterns.map(intern => ({
                            ...intern,
                            teamLeadName: teamLeadName
                        }));
                    }
                } else {
                    toast.error("You are not authorized to view this page.");
                    setLoading(false);
                    return;
                }
                
                setInterns(internUsers);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(error.response?.data?.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        if(currentUser){
             fetchInterns();
        } else {
             setLoading(false);
             toast.error("Could not retrieve user details.");
        }
       
    }, [currentUser]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Interns</h4>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <p>Loading interns...</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Team Lead</th>
                                                <th>Status</th>
                                                <th>Tasks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {interns.map(intern => (
                                                <tr key={intern.id}>
                                                    <td>{intern.firstName} {intern.lastName}</td>
                                                    <td>{intern.email}</td>
                                                    <td>
                                                        <span className="badge badge-primary">{intern.role}</span>
                                                    </td>
                                                    <td>{intern.teamLeadName}</td>
                                                    <td>
                                                        <span className={`badge ${intern.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                            {intern.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {intern.assignedTasks && intern.assignedTasks.length > 0 ? (
                                                            <ul>
                                                                {intern.assignedTasks.map(task => (
                                                                    <li key={task.id}>{task.title} - {task.status}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p>No tasks assigned</p>
                                                        )}
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

export default Interns;
