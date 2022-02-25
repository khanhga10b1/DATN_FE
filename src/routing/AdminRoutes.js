import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoutes = ({ component: Component, ...rest }) => {
    const {isAdminAuthenticated, admin} = useSelector(state => state.auth);
    return (
        <Route {...rest} render={props => ((isAdminAuthenticated) ? <Component {...props} /> : <Redirect to='/admin/login' />)} />
    );
};

export default AdminRoutes;
