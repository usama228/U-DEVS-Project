import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDistributionChart = ({ data }) => {
    const chartData = {
        labels: ['Total Users', 'Internees', 'Team Leads', 'Employees'],
        datasets: [
            {
                data: [
                    data.totalUsers || 0,
                    data.totalInternees || 0,
                    data.totalTeamLeads || 0,
                    data.totalEmployees || 0,
                ],
                backgroundColor: [
                    '#4D44B5',
                    '#2B7D2B',
                    '#FFAB2D',
                    '#3E8EED',
                ],
                borderColor: [
                    '#ffffff',
                    '#ffffff',
                    '#ffffff',
                    '#ffffff',
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                 labels: {
                    font: {
                        size: 14,
                    },
                    color: '#333',
                    padding: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += context.parsed;
                        }
                        return label;
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return <Pie data={chartData} options={options} />;
};

export default UserDistributionChart;
