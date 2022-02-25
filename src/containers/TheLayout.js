import React, { Suspense, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import TheHeader from "./TheHeader";

import routes from "../routing/routes";
import TheFooter from "./TheFooter";
import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "../routing/ProtectedRoute";
import accountRoutes from "../routing/accountRoutes";
import { loadUser } from "../actions/auth";
import { useDispatch } from "react-redux";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheLayout = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(loadUser())
  },[])
  return (
    <>
      <TheHeader />
      <Suspense fallback={loading}>
        <ScrollToTop />
        <Switch>
          {routes.map((route, idx) => {
            return (
              route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  name={route.name}
                  exact={route.exact}
                  render={(props) => <route.component {...props} />}
                />
              )
            );
          })}

          {accountRoutes.map((route, idx) => {
            return (
              route.component && (
                <ProtectedRoute
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
      {/* <TheFooter /> */}
    </>
  );
};

export default React.memo(TheLayout);
