import React from 'react';

const Dashboard = React.lazy(() => import('../views/AccountPage/Dashboard'));
const accountRoutes = [
    {
        id: 0,
        exact: true,
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    } 
    
];

export default accountRoutes;
