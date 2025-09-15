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
        content: [
            {
                title: 'Overview',
                to: 'dashboard',
            },
            {
                title: 'Analysis',
                to: 'analysis',
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
                role: ['employee', 'internee'] // All can see their own tasks
            },
        ],
    },
    {
        title: 'Student',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">school</i>,
        content: [
            {
                title: 'Student',
                to: 'student',
            },
            {
                title: 'Student Detail',
                to: 'student-detail',
            },
            {
                title: 'Add New Student',
                to: 'add-student',
            },
        ],
    },
    {
        title:'Teacher',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">person</i>,
        content: [
            {
                title: 'Teacher',
                to: 'teacher',
            },
            {
                title: 'Teacher Detail',
                to: 'teacher-detail',
            },
            {
                title: 'Add New Teacher',
                to: 'add-teacher',
            },
        ],
    },
    {
        title:'Food',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">restaurant_menu</i>,
        content: [
            {
                title: 'Food menu',
                to: 'food',
            },
            {
                title: 'Food Detail',
                to: 'food-details',
            },
        ],
    },
    {
        title: 'File Manager',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">folder</i>,
        content: [
            {
                title: 'File Manager',
                to: 'file-manager',
            },
            {
                title: 'User',
                to: 'user',
            },
            {
                title: 'Calendar',
                to: 'calendar',
            },            
            {
                title: 'Chat',
                to: 'chat',
            },
            {
                title: 'Activity',
                to: 'activity',
            },
        ],
    },        
    //Apps
    {
        title: 'Apps',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">app_registration </i>,
        content: [
            {
                title: 'Profile',
                to: 'app-profile',
            },
            {
                title: 'Edit Profile',
                to: 'edit-profile',
            },
            {
                title: 'Post Details',
                to: 'post-details',
            },
            {
                title: 'Email',
                //to: './',
                hasMenu : true,
                content: [
                    {
                        title: 'Compose',
                        to: 'email-compose',
                    },
                    {
                        title: 'Index',
                        to: 'email-inbox',
                    },
                    {
                        title: 'Read',
                        to: 'email-read',
                    }
                ],
            },
            {
                title:'Calendar',
                to: 'app-calender',
            },
            {
                title: 'Shop',
                //to: './',
                hasMenu : true,
                content: [
                    {
                        title: 'Product Grid',
                        to: 'ecom-product-grid',
                    },
                    {
                        title: 'Product List',
                        to: 'ecom-product-list',
                    },
                    {
                        title: 'Product Details',
                        to: 'ecom-product-detail',
                    },
                    {
                        title: 'Order',
                        to: 'ecom-product-order',
                    },
                    {
                        title: 'Checkout',
                        to: 'ecom-checkout',
                    },
                    {
                        title: 'Invoice',
                        to: 'ecom-invoice',
                    },
                    {
                        title: 'Customers',
                        to: 'ecom-customers',
                    },
                ],
            },
        ],
    },
    //Charts
    {
        title: 'Charts',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">assessment</i>,
        content: [            
            {
                title: 'RechartJs',
                to: 'chart-rechart',
            },
            {
                title: 'Chartjs',
                to: 'chart-chartjs',
            },
            {
                title: 'Sparkline',
                to: 'chart-sparkline',
            },
            {
                title: 'Apexchart',
                to: 'chart-apexchart',
            },
        ]
    },
    //Boosttrap
    {
        title: 'Bootstrap',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">favorite</i>,
        content: [
            {
                title: 'Accordion',
                to: 'ui-accordion',
            },
            {
                title: 'Alert',
                to: 'ui-alert',
            },
            {
                title: 'Badge',
                to: 'ui-badge',
            },
            {
                title: 'Button',
                to: 'ui-button',
            },
            {
                title: 'Modal',
                to: 'ui-modal',
            },
            {
                title: 'Button Group',
                to: 'ui-button-group',
            },
            {
                title: 'List Group',
                to: 'ui-list-group',
            },
            {
                title: 'Cards',
                to: 'ui-card',
            },
            {
                title: 'Carousel',
                to: 'ui-carousel',
            },
            {
                title: 'Dropdown',
                to: 'ui-dropdown',
            },
            {
                title: 'Popover',
                to: 'ui-popover',
            },
            {
                title: 'Progressbar',
                to: 'ui-progressbar',
            },
            {
                title: 'Tab',
                to: 'ui-tab',
            },
            {
                title: 'Typography',
                to: 'ui-typography',
            },
            {
                title: 'Pagination',
                to: 'ui-pagination',
            },
            {
                title: 'Grid',
                to: 'ui-grid',
            },
        ]
    },
    //plugins
    {
        title:'Plugins',
        classsChange: 'mm-collapse',
        iconStyle : <i className="material-icons">extension </i>,
        content : [
            {
                title:'Select 2',
                to: 'uc-select2',
            },
            {
                title:'Noui Slider',
                to: 'uc-noui-slider',
            },
            {
                title:'Sweet Alert',
                to: 'uc-sweetalert',
            },
            {
                title:'Toastr',
                to: 'uc-toastr',
            },           
            {
                title:'Light Gallery',
                to: 'uc-lightgallery',
            },
        ]
    },
    //Widget
    {
        title:'Widget',
        iconStyle: <i className="material-icons">widgets</i>,
        to: 'widget',
    },
    //Forms
    {
        title:'Forms',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">insert_drive_file</i>,
        content : [
            {
                title:'Form Elements',
                to: 'form-element',
            },
            {
                title:'Wizard',
                to: 'form-wizard',
            },
            {
                title:'CkEditor',
                to: 'form-ckeditor',
            },
            {
                title:'Pickers',
                to: 'form-pickers',
            },
            {
                title:'Form Validate',
                to: 'form-validation',
            },
        ]
    },
    //Table
    {
        title:'Table',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">table_chart</i>,
        content : [
            {
                title:'Table Filtering',
                to: 'table-filtering',
            },
            {
                title:'Table Sorting',
                to: 'table-sorting',
            },
            {
                title:'Bootstrap',
                to: 'table-bootstrap-basic',
            },
        ]
    },
    //Pages
    {
        title:'Pages',
        classsChange: 'mm-collapse',
        iconStyle: <i className="merial-icons">article</i>,
        content : [
            {
                title:'Error',
                hasMenu : true,
                content : [
                    {
                        title: 'Error 400',
                        to : 'page-error-400',
                    },
                    {
                        title: 'Error 403',
                        to : 'page-error-403',
                    },
                    {
                        title: 'Error 404',
                        to : 'page-error-404',
                    },
                    {
                        title: 'Error 500',
                        to : 'page-error-500',
                    },
                    {
                        title: 'Error 503',
                        to : 'page-error-503',
                    },
                ],
            },
            {
                title:'Lock Screen',
                to: 'page-lock-screen',
            },
        ]
    },

]
