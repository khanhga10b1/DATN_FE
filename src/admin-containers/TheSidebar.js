import { Avatar } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { Feather } from "../components";
import { getInitialsName } from "../utils/mathUtil";
const TheSidebar = () => {
  const { admin } = useSelector((store) => store.auth);
  const history = useHistory();
  return (
    <div className="sidebar">
      <div style={{ padding: "15px", cursor :"pointer"}} onClick={()=> history.push("/admin/profile")}>
        <Avatar
          src={admin?.avatar}
          style={{
            width: "120px",
            height: "120px",
            margin: "10px auto",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          {getInitialsName(admin?.name)}
        </Avatar>  <div className="row">
          {" "}
          <span style={{ margin: "auto", fontSize: "15px" }}>{admin?.role.name}</span>
        </div>
        <div className="row">
          {" "}
          <span style={{ margin: "auto", color : "white" }}>{admin?.name}</span>
        </div>
      </div>
      <NavLink exact={true} to="/admin">
        <Feather name="Grid" />
        <span>Thống kê</span>
      </NavLink>
      <NavLink to="/admin/accounts">
        <Feather name="User" />
        <span>Người dùng</span>
      </NavLink>
      <NavLink to="/admin/admins">
        <Feather name="Users" />
        <span>Quản trị viên</span>
      </NavLink>
      <NavLink to="/admin/profile">
        <Feather name="BookOpen" />
        <span>Thông tin cá nhân</span>
      </NavLink>
    </div>
  );
};

export default TheSidebar;
