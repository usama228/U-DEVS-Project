import React, { useState, useEffect } from 'react';
import { UserService } from '../../services/UserService';
import { toast } from 'react-toastify';

const TeamLeads = () => {
    const [teamLeads, setTeamLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamLeads = async () => {
            try {
                const response = await UserService.getAllUsers();
                if (response.data.success) {
                    const allUsers = response.data.data.users;
                    const leadUsers = allUsers.filter(user => user.role === 'team_lead');
                    setTeamLeads(leadUsers);
                }
            } catch (error) {
                console.error("Error fetching team leads:", error);
                toast.error("Failed to fetch team leads");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamLeads();
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Team Leads</h4>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <p>Loading team leads...</p>
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
                                            {teamLeads.map(lead => (
                                                <tr key={lead.id}>
                                                    <td>{lead.firstName} {lead.lastName}</td>
                                                    <td>{lead.email}</td>
                                                    <td>{lead.role}</td>
                                                    <td>
                                                        <span className={`badge ${lead.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                            {lead.isActive ? 'Active' : 'Inactive'}
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

export default TeamLeads;
