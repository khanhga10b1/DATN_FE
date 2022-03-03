import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {logout, logoutAdmin} from "../actions/auth";
import { Feather } from "../components";

const TheHeader = () => {
  let history = useHistory();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAdmin());
    history.push("/admin/login");
  };
  return (
    <header className="header" style={{ background: "#032a40" }}>
      <div className="header_content d-flex flex-row align-items-center justify-content-between">
        <div className="logo">
          <NavLink to="/">The K</NavLink>
        </div>
        <div className="ml-auto d-flex flex-row align-items-center justify-content-start">
          <Feather
            onClick={handleLogout}
            name="LogOut"
            style={{ marginRight: "30px", width: "30px", color: "white" }}
          />
          <div className="hamburger">
            <i className="fa fa-bars" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TheHeader;
