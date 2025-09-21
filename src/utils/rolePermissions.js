// Role-based permissions and route access control

export const USER_ROLES = {
    ADMIN: 'admin',
    TEAM_LEAD: 'team_lead',
    EMPLOYEE: 'employee',
    INTERNEE: 'internee'
};

// Define allowed routes for each role
export const ROLE_ROUTES = {
    [USER_ROLES.ADMIN]: [
        '/dashboard',
        '/analysis',
        '/dashboard-dark',
        '/users',
        '/team-leads',
        '/employees',
        '/interns',
        '/create-user',
        '/all-tasks',
        '/create-task',
        '/task',
        '/my-tasks',
        '/task-reviews',
        '/profile',
        '/user-profile/:id',
        '/user-profile',
        '/app-profile',
        '/student',
        '/student-detail',
        '/add-student',
        '/teacher',
        '/teacher-detail',
        '/add-teacher',
        '/food',
        '/food-details',
        '/settings',
        '/analytics',
        '/reports',
        '/file-manager',
        '/calendar',
        '/chat',
        '/activity'
    ],
    [USER_ROLES.TEAM_LEAD]: [
        '/dashboard',
        '/analysis',
        '/dashboard-dark',
        '/all-tasks',
        '/create-task',
        '/my-tasks',
        '/task-reviews',
        '/task',
        '/user-profile/:id',
        '/user-profile',
        '/my-team',
        '/interns',
        '/profile',
        '/app-profile',
        '/student',
        '/student-detail',
        '/add-student',
        '/food',
        '/food-details',
        '/calendar',
        '/chat',
        '/activity'
    ],
    [USER_ROLES.EMPLOYEE]: [
        '/dashboard',
        '/dashboard-dark',
        '/all-tasks',
        '/profile',
        '/app-profile',
        '/calendar',
        '/chat',
        '/activity',
        '/file-manager'
    ],
    [USER_ROLES.INTERNEE]: [
        '/dashboard',
        '/analysis',
        '/dashboard-dark',
        '/my-tasks',      
        '/task',
        '/profile',
        '/app-profile',
        '/calendar',
        '/chat',
        '/activity'
    ]
};

// Define API permissions for each role
export const API_PERMISSIONS = {
    [USER_ROLES.ADMIN]: {
        auth: ['register', 'login', 'profile', 'change-password'],
        users: ['all-users', 'create-user', 'update-user', 'delete-user', 'team-leads', 'internees', 'dashboard-stats', 'update-status', 'update-role'],
        tasks: ['create', 'all-tasks', 'task-details', 'accept', 'reject', 'delete']
    },
    [USER_ROLES.TEAM_LEAD]: {
        auth: ['login', 'profile', 'change-password'],
        users: ['internees', 'team-internees'],
        tasks: ['create', 'all-tasks', 'task-details']
    },
    [USER_ROLES.EMPLOYEE]: {
        auth: ['login', 'profile', 'change-password'],
        users: [],
        tasks: ['all-tasks', 'task-details', 'submit']
    },
    [USER_ROLES.INTERNEE]: {
        auth: ['login', 'profile', 'change-password'],
        users: [],
        tasks: ['all-tasks', 'task-details', 'submit']
    }
};

// Utility functions
export const hasRouteAccess = (userRole, route) => {
    if (!userRole || !route) return false;
    console.log('hasRouteAccess called with role:', userRole, 'and route:', route);
    const allowedRoutes = ROLE_ROUTES[userRole] || [];
    return allowedRoutes.includes(route);
};

export const hasApiPermission = (userRole, category, permission) => {
    if (!userRole || !category || !permission) return false;
    const rolePermissions = API_PERMISSIONS[userRole];
    if (!rolePermissions || !rolePermissions[category]) return false;
    return rolePermissions[category].includes(permission);
};

export const hasApiAccess = (userRole, apiName) => {
    if (!userRole || !apiName) return false;
    
    // Map API names to category and permission
    const apiMapping = {
        'getAllUsers': { category: 'users', permission: 'all-users' },
        'createUser': { category: 'users', permission: 'create-user' },
        'updateUser': { category: 'users', permission: 'update-user' },
        'deleteUser': { category: 'users', permission: 'delete-user' },
        'createTask': { category: 'tasks', permission: 'create' },
        'viewTasks': { category: 'tasks', permission: 'all-tasks' },
        'submitTask': { category: 'tasks', permission: 'submit' },
        'acceptTask': { category: 'tasks', permission: 'accept' },
        'rejectTask': { category: 'tasks', permission: 'reject' }
    };
    
    const mapping = apiMapping[apiName];
    if (!mapping) return false;
    
    return hasApiPermission(userRole, mapping.category, mapping.permission);
};

export const getNavigationItems = (userRole) => {
    if (!userRole) return [];

    const baseItems = [
        { 
            path: '/dashboard', 
            title: 'Dashboard', 
            icon: 'dashboard',
            roles: [USER_ROLES.ADMIN, USER_ROLES.TEAM_LEAD, USER_ROLES.EMPLOYEE, USER_ROLES.INTERNEE]
        }
    ];

    const roleSpecificItems = {
        [USER_ROLES.ADMIN]: [
            { path: '/users', title: 'All Users', icon: 'people', roles: [USER_ROLES.ADMIN] },
            { path: '/tasks', title: 'All Tasks', icon: 'assignment', roles: [USER_ROLES.ADMIN] },
            { path: '/analytics', title: 'Analytics', icon: 'analytics', roles: [USER_ROLES.ADMIN] },
            { path: '/reports', title: 'Reports', icon: 'assessment', roles: [USER_ROLES.ADMIN] }
        ],
        [USER_ROLES.TEAM_LEAD]: [
            { path: '/tasks', title: 'Tasks', icon: 'assignment', roles: [USER_ROLES.TEAM_LEAD] },
            { path: '/my-team', title: 'My Team', icon: 'group', roles: [USER_ROLES.TEAM_LEAD] },
            { path: '/internees', title: 'Internees', icon: 'school', roles: [USER_ROLES.TEAM_LEAD] }
        ],
        [USER_ROLES.EMPLOYEE]: [
            { path: '/my-tasks', title: 'My Tasks', icon: 'assignment_ind', roles: [USER_ROLES.EMPLOYEE, USER_ROLES.INTERNEE] }
        ],
        [USER_ROLES.INTERNEE]: [
            { path: '/my-tasks', title: 'My Tasks', icon: 'assignment_ind', roles: [USER_ROLES.EMPLOYEE, USER_ROLES.INTERNEE] }
        ]
    };

    const allItems = [...baseItems, ...(roleSpecificItems[userRole] || [])];
    
    // Filter items based on user role
    return allItems.filter(item => 
        item.roles.includes(userRole)
    );
};

export const formatUserRole = (role) => {
    if (!role) return 'User';
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
