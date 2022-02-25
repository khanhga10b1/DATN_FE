import React, { Suspense, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import TheHeader from "./TheHeader";
import ScrollToTop from "./ScrollToTop";
import AdminRoutes from "../routing/AdminRoutes";
import admin_routes from "../routing/admin_routes";
import TheSidebar from "./TheSidebar";
import { loadAdmin } from "../actions/auth";
import { useDispatch } from "react-redux";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const Login = React.lazy(() => import("../views/AdminPage/Login/Login"));

const TheLayout = () => {
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(loadAdmin())
  },[])
  return (
    <>
      <TheHeader />
      <div className = "admin-layout">
        <TheSidebar />
       <div className="main">
       <Suspense fallback={loading}>
        <ScrollToTop />
        <Switch>
          <Route path="/admin/login" render={(props) => <Login {...props} />} />
          {admin_routes.map((route, idx) => {
            return (
              route.component && (
                <AdminRoutes
                  key={idx}
                  path={route.path}
                  name={route.name}
                  exact={route.exact}
                  component={(props) => <route.component {...props} />}
                />
              )
            );
          })}

        </Switch>
      </Suspense>
       </div>
      </div>
      {/* <TheFooter /> */}
    </>
  );
};

export default React.memo(TheLayout);
