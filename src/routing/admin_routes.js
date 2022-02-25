import React from "react";

const Dashboard = React.lazy(() => import("../views/AdminPage/Dashboard"));
const Accounts = React.lazy(() => import("../views/AdminPage/Accounts"));
const Admin = React.lazy(() => import("../views/AdminPage/Admin"));
const Profile = React.lazy(() => import("../views/AdminPage/Profile"));

const routes = [
  {
    id: 2,
    exact: true,
    path: "/admin/accounts",
    name: "Accounts",
    component: Accounts,
  },
  {
    id: 3,
    exact: true,
    path: "/admin/profile",
    name: "Profile",
    component: Profile,
  },
  {
    id: 4,
    exact: true,
    path: "/admin/admins",
    name: "Admin",
    component: Admin,
  },
  {
    id: 1,
    exact: true,
    path: "/admin",
    name: "Dashboard",
    component: Dashboard,
  }
];

export default routes;
