// Function to filter menu items based on user role
export const filterMenuByRole = (menuList, userRole) => {
    if (!userRole) return [];

    return menuList.filter(menuItem => {
        // Check if the main menu item is accessible for the user role
        if (menuItem.role && !menuItem.role.includes(userRole)) {
            return false;
        }

        // If menu item has content (submenu), filter the submenu items
        if (menuItem.content) {
            const filteredContent = menuItem.content.filter(subItem => {
                // If subItem has role restrictions, check them
                if (subItem.role && !subItem.role.includes(userRole)) {
                    return false;
                }

                // If subItem has nested content, filter that too
                if (subItem.content) {
                    const filteredNestedContent = subItem.content.filter(nestedItem => {
                        return !nestedItem.role || nestedItem.role.includes(userRole);
                    });
                    subItem.content = filteredNestedContent;
                    return filteredNestedContent.length > 0;
                }

                return true;
            });

            // If after filtering, there are no accessible subitems, hide the main menu
            if (filteredContent.length === 0 && menuItem.role) {
                return false;
            }

            menuItem.content = filteredContent;
        }

        return true;
    });
};

export const MenuList = [
    //Dashboard
    {
        title: 'Dashboard',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">dashboard</i>,
        role: ['admin', 'team_lead', 'employee', 'internee'], // All roles can access dashboard
        content: [
            {
                title: 'Overview',
                to: 'dashboard',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },
            {
                title: 'Analytics',
                to: 'dashboard-dark',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },
        ],
    },
    //User Management
    {
        title: 'User Management',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-symbols-outlined">people</i>,
        role: ['admin', 'team_lead'], // Only admin and team leads can access user management
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
                title: 'Internees',
                to: 'internees',
                role: ['admin', 'team_lead'] // Admin and team leads can view internees
            },
            {
                title: 'My Profile',
                to: 'profile',
                role: ['admin', 'team_lead', 'employee', 'internee'] // All can view their profile
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
                to: 'tasks',
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
                role: ['admin', 'team_lead', 'employee', 'internee'] // All can see their own tasks
            },
            {
                title: 'Task Reviews',
                to: 'task-reviews',
                role: ['admin', 'team_lead'] // Only admin and team leads can review tasks
            },
        ],
    },
    {
        title: 'Student',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">school</i>,
        role: ['admin', 'team_lead'], // Only admin and team leads can manage students
        content: [
            {
                title: 'Student',
                to: 'student',
                role: ['admin', 'team_lead']
            },
            {
                title: 'Student Detail',
                to: 'student-detail',
                role: ['admin', 'team_lead']
            },
            {
                title: 'Add New Student',
                to: 'add-student',
                role: ['admin', 'team_lead']
            },
        ],
    },
    {
        title:'Teacher',
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">person</i>,
        role: ['admin'], // Only admin can manage teachers
        content: [
            {
                title: 'Teacher',
                to: 'teacher',
                role: ['admin']
            },
            {
                title: 'Teacher Detail',
                to: 'teacher-detail',
                role: ['admin']
            },
            {
                title: 'Add New Teacher',
                to: 'add-teacher',
                role: ['admin']
            },
        ],
    },
    {
        title:'Food',
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-symbols-outlined">restaurant_menu</i>,
        role: ['admin', 'team_lead'], // Only admin and team leads can manage food
        content: [
            {
                title: 'Food menu',
                to: 'food',
                role: ['admin', 'team_lead']
            },
            {
                title: 'Food Detail',
                to: 'food-details',
                role: ['admin', 'team_lead']
            },
        ],
    },
    {
        title: 'File Manager',	
        classsChange: 'mm-collapse',		
        iconStyle: <i className="material-icons">folder</i>,
        role: ['admin', 'team_lead', 'employee'], // Employees and above can access file management
        content: [
            {
                title: 'File Manager',
                to: 'file-manager',
                role: ['admin', 'team_lead', 'employee']
            },
            {
                title: 'User',
                to: 'user',
                role: ['admin', 'team_lead']
            },
            {
                title: 'Calendar',
                to: 'calendar',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },            
            {
                title: 'Chat',
                to: 'chat',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },
            {
                title: 'Activity',
                to: 'activity',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },
        ],
    },        
    //Apps
    {
        title: 'Apps',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">app_registration </i>,
        role: ['admin', 'team_lead', 'employee', 'internee'], // All roles can access apps
        content: [
            {
                title: 'Profile',
                to: 'app-profile',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },
            {
                title: 'Edit Profile',
                to: 'edit-profile',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },
            {
                title: 'Post Details',
                to: 'post-details',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },
            {
                title: 'Email',
                //to: './',
                hasMenu : true,
                role: ['admin', 'team_lead', 'employee'], // Employees and above can access email
                content: [
                    {
                        title: 'Compose',
                        to: 'email-compose',
                        role: ['admin', 'team_lead', 'employee']
                    },
                    {
                        title: 'Index',
                        to: 'email-inbox',
                        role: ['admin', 'team_lead', 'employee']
                    },
                    {
                        title: 'Read',
                        to: 'email-read',
                        role: ['admin', 'team_lead', 'employee']
                    }
                ],
            },
            {
                title:'Calendar',
                to: 'app-calender',
                role: ['admin', 'team_lead', 'employee', 'internee']
            },
            {
                title: 'Shop',
                //to: './',
                hasMenu : true,
                role: ['admin', 'team_lead'], // Only admin and team leads can access shop management
                content: [
                    {
                        title: 'Product Grid',
                        to: 'ecom-product-grid',
                        role: ['admin', 'team_lead']
                    },
                    {
                        title: 'Product List',
                        to: 'ecom-product-list',
                        role: ['admin', 'team_lead']
                    },
                    {
                        title: 'Product Details',
                        to: 'ecom-product-detail',
                        role: ['admin', 'team_lead']
                    },
                    {
                        title: 'Order',
                        to: 'ecom-product-order',
                        role: ['admin', 'team_lead']
                    },
                    {
                        title: 'Checkout',
                        to: 'ecom-checkout',
                        role: ['admin', 'team_lead']
                    },
                    {
                        title: 'Invoice',
                        to: 'ecom-invoice',
                        role: ['admin', 'team_lead']
                    },
                    {
                        title: 'Customers',
                        to: 'ecom-customers',
                        role: ['admin', 'team_lead']
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
        role: ['admin'], // Only admin can access charts/analytics tools
        content: [            
            {
                title: 'RechartJs',
                to: 'chart-rechart',
                role: ['admin']
            },
            {
                title: 'Chartjs',
                to: 'chart-chartjs',
                role: ['admin']
            },
            {
                title: 'Sparkline',
                to: 'chart-sparkline',
                role: ['admin']
            },
            {
                title: 'Apexchart',
                to: 'chart-apexchart',
                role: ['admin']
            },
        ]
    },
    //Boosttrap
    {
        title: 'Bootstrap',	
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">favorite</i>,
        role: ['admin'], // Only admin can access UI components
        content: [
            {
                title: 'Accordion',
                to: 'ui-accordion',
                role: ['admin']
            },
            {
                title: 'Alert',
                to: 'ui-alert',
                role: ['admin']
            },
            {
                title: 'Badge',
                to: 'ui-badge',
                role: ['admin']
            },
            {
                title: 'Button',
                to: 'ui-button',
                role: ['admin']
            },
            {
                title: 'Modal',
                to: 'ui-modal',
                role: ['admin']
            },
            {
                title: 'Button Group',
                to: 'ui-button-group',
                role: ['admin']
            },
            {
                title: 'List Group',
                to: 'ui-list-group',
                role: ['admin']
            },
            {
                title: 'Cards',
                to: 'ui-card',
                role: ['admin']
            },
            {
                title: 'Carousel',
                to: 'ui-carousel',
                role: ['admin']
            },
            {
                title: 'Dropdown',
                to: 'ui-dropdown',
                role: ['admin']
            },
            {
                title: 'Popover',
                to: 'ui-popover',
                role: ['admin']
            },
            {
                title: 'Progressbar',
                to: 'ui-progressbar',
                role: ['admin']
            },
            {
                title: 'Tab',
                to: 'ui-tab',
                role: ['admin']
            },
            {
                title: 'Typography',
                to: 'ui-typography',
                role: ['admin']
            },
            {
                title: 'Pagination',
                to: 'ui-pagination',
                role: ['admin']
            },
            {
                title: 'Grid',
                to: 'ui-grid',
                role: ['admin']
            },
        ]
    },
    //plugins
    {
        title:'Plugins',
        classsChange: 'mm-collapse',
        iconStyle : <i className="material-icons">extension </i>,
        role: ['admin'], // Only admin can access plugins
        content : [
            {
                title:'Select 2',
                to: 'uc-select2',
                role: ['admin']
            },
            {
                title:'Noui Slider',
                to: 'uc-noui-slider',
                role: ['admin']
            },
            {
                title:'Sweet Alert',
                to: 'uc-sweetalert',
                role: ['admin']
            },
            {
                title:'Toastr',
                to: 'uc-toastr',
                role: ['admin']
            },           
            {
                title:'Light Gallery',
                to: 'uc-lightgallery',
                role: ['admin']
            },
        ]
    },
    //Widget
    {   
        title:'Widget',        
        iconStyle: <i className="material-icons">widgets</i>,
        to: 'widget',
        role: ['admin'] // Only admin can access widgets
    },
    //Forms
    {
        title:'Forms',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">insert_drive_file</i>,
        role: ['admin', 'team_lead'], // Admin and team leads can access forms
        content : [
            {
                title:'Form Elements',
                to: 'form-element',
                role: ['admin', 'team_lead']
            },
            {
                title:'Wizard',
                to: 'form-wizard',
                role: ['admin', 'team_lead']
            },
            {
                title:'CkEditor',
                to: 'form-ckeditor',
                role: ['admin', 'team_lead']
            },
            {
                title:'Pickers',
                to: 'form-pickers',
                role: ['admin', 'team_lead']
            },
            {
                title:'Form Validate',
                to: 'form-validation',
                role: ['admin', 'team_lead']
            },
        ]
    },
    //Table
    {
        title:'Table',
        classsChange: 'mm-collapse',
        iconStyle: <i className="material-icons">table_chart</i>,
        role: ['admin', 'team_lead'], // Admin and team leads can access table features
        content : [
            {
                title:'Table Filtering',
                to: 'table-filtering',
                role: ['admin', 'team_lead']
            },
            {
                title:'Table Sorting',
                to: 'table-sorting',
                role: ['admin', 'team_lead']
            },
            {
                title:'Bootstrap',
                to: 'table-bootstrap-basic',
                role: ['admin', 'team_lead']
            },
        ]
    },
    //Pages
    {
        title:'Pages',
        classsChange: 'mm-collapse',
        iconStyle: <i className="merial-icons">article</i>,
        role: ['admin'], // Only admin can access error pages and system pages
        content : [
            {
                title:'Error',
                hasMenu : true,
                role: ['admin'],
                content : [
                    {
                        title: 'Error 400',
                        to : 'page-error-400',
                        role: ['admin']
                    },
                    {
                        title: 'Error 403',
                        to : 'page-error-403',
                        role: ['admin']
                    },
                    {
                        title: 'Error 404',
                        to : 'page-error-404',
                        role: ['admin']
                    },
                    {
                        title: 'Error 500',
                        to : 'page-error-500',
                        role: ['admin']
                    },
                    {
                        title: 'Error 503',
                        to : 'page-error-503',
                        role: ['admin']
                    },
                ],
            },
            {
                title:'Lock Screen',
                to: 'page-lock-screen',
                role: ['admin']
            },
        ]
    },
    
]