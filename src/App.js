import React, { useEffect } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import createStore from "./store/store";
import { loadAdmin, loadUser } from "./actions/auth";
import "./scss/_custom.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-slideshow-image/dist/styles.css";
import "react-step-progress/dist/index.css";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import 'react-big-calendar/lib/css/react-big-calendar.css';

import socketIOClient from "socket.io-client";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const store = createStore;

const Login = React.lazy(() => import("./views/Pages/Login/Login"));
const Register = React.lazy(() => import("./views/Pages/Register/Register"));
const DefaultLayout = React.lazy(() => import("./containers/TheLayout"));
const AdminLayout = React.lazy(() => import("./admin-containers/TheLayout"));
const AdminLogin = React.lazy(() => import("./views/AdminPage/Login/Login"));

const App = () => {

  // const socket = socketIOClient("localhost:3006");

  // socket.on("push-notif", (message) => {
  //   console.log(message);
  //   NotificationManager.info(message.message,message.title,1000000);
  // });

  return (
    <Provider store={store}>
      <NotificationContainer />
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/admin/login" component={AdminLogin} />
            <Route path="/admin" component={AdminLayout} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/" component={DefaultLayout} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
