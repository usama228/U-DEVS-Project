import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatusChart = ({ data }) => {
    const chartData = {
        labels: ['Total Tasks', 'Pending Tasks', 'Completed Tasks', 'Rejected Tasks'],
        datasets: [
            {
                data: [
                    data.totalTasks || 0,
                    data.pendingTasks || 0,
                    data.completedTasks || 0,
                    data.rejectedTasks || 0,
                ],
                backgroundColor: [
                    '#7E7E7E',
                    '#FFD600',
                    '#4CAF50',
                    '#F44336',
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

export default TaskStatusChart;
