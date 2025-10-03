import { cloneDeep } from 'lodash';

// Function to filter menu items based on user role
export const filterMenuByRole = (originalMenuList, userRole) => {
    if (!userRole) {
        return []; // Return empty if no role
    }

    const menuList = cloneDeep(originalMenuList);

    const recursiveFilter = (items) => {
        return items.reduce((acc, item) => {
            // An item is accessible if it has no role specified, or if the user's role is in its list.
            const hasAccess = !item.role || item.role.includes(userRole);

            if (hasAccess) {
                const newItem = { ...item };

                // If the item has children (content), filter them recursively.
                if (Array.isArray(item.content) && item.content.length > 0) {
                    newItem.content = recursiveFilter(item.content);
                }

                // A parent menu item should only be included if:
                // 1. It is a direct link itself (has a 'to' property).
                // 2. Or, after filtering, it still has accessible children.
                if (newItem.to || (newItem.content && newItem.content.length > 0)) {
                    acc.push(newItem);
                }
            }
            return acc;
        }, []);
    };

    return recursiveFilter(menuList);
};


export const MenuList = [
    //Dashboard
    {
        title: 'Dashboard',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">dashboard</i>,
        role: ['admin', 'team_lead', 'employee', 'internee'], // All roles can view dashboard
        content: [
            {
                title: 'Overview',
                to: 'dashboard',
                role: ['admin', 'team_lead', 'employee', 'internee'], // All can view overview
            },
            {
                title: 'Analysis',
                to: 'analysis',
                role: ['admin', 'team_lead', 'internee'],
            },
        ],
    },
    {
        title: 'My Profile',
        iconStyle: <i className="material-symbols-outlined">person</i>,
        to: 'profile',
        role: ['admin', 'team_lead', 'employee', 'internee'], // All can view their profile
    },
    //User Management
    {
        title: 'User Management',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">people</i>,
        role: ['admin', 'team_lead'], 
        content: [
            {
                title: 'All Users',
                to: 'users',
                role: ['admin'] // Only admin can view all users
            },
            {
                title: 'Create User',
                to: 'create-user',
                role: ['admin'] // Only admin can create users
            },
            {
                title: 'Team Leads',
                to: 'team-leads',
                role: ['admin'] // Only admin can manage team leads
            },
            {
                title: 'Employees',
                to: 'employees',
                role: ['admin'] // Only admin can manage employees
            },
            {
                title: 'Internees',
                to: 'interns',
                role: ['admin', 'team_lead'] // Admin and team leads can view interns
            },
        ],
    },
    //Task Management
    {
        title: 'Task Management',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">task</i>,
        role: ['admin', 'team_lead', 'employee', 'internee'], // All roles have task management
        content: [
            {
                title: 'All Tasks',
                to: 'all-tasks',
                role: ['admin', 'team_lead'] // Only admin and team leads can see all tasks
            },
            {
                title: 'Create Task',
                to: 'create-task',
                role: ['admin', 'team_lead'] // Admin and team leads can create tasks
            },
            {
                title: 'My Tasks',
                to: 'my-tasks',
                role: ['internee'] // Only internees can see their own tasks
            },
        ],
    },
    {
        title: 'Attendance',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">folder</i>,
        content: [
            {
                title: 'Attendance',
                iconStyle: <i className="material-symbols-outlined">event_available</i>,
                to: 'attendance',
                role: ['admin', 'team_lead', 'employee', 'internee'],
            },
            {
                title: 'Leaves',
                iconStyle: <i className="material-symbols-outlined">event_busy</i>,
                to: 'leaves',
                role: ['admin', 'team_lead', 'employee', 'internee'],
            },
        ],
    }, 
]
