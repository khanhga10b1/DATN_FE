import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../../actions/auth";
import { Redirect } from "react-router-dom";
import { Button, TextField, Spinner } from "../../../components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isAdminAuthenticated, loading, msg } = useSelector((state) => state.auth);

  function login(e) {
    dispatch(loginAdmin(email, password));
  }

  if (isAdminAuthenticated) {
    return <Redirect to="/admin" />;
  }

  return (
    <div className="admin container-fluid">
      <div className="min-vh-100 flex-column align-items-center justify-content-center">
        <div className="sigin-copyright text-center">
          {/* <img src={''} className='img img-responsive' alt='Responsive image' /> */}
        </div>
        <div className="signinbox bg-white">
          {/* <div className="signin-header text-center">
            <h2 className="widget-title mb-3">Đăng nhập</h2>
          </div> */}
          <span style={{color : "red"}}>{msg}</span>
          <div className="form-group">
            <label>EMAIL</label>
            <TextField required={true}
              placeholder=""
              type="text"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <TextField
                required={true}
              placeholder=""
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <Button
                disabled={!email || !password}
              customClass="btn--block btn--primary"
              style={{ margin: "1rem auto", height: "42px" }}
              htmlType="submit"
              type="primary"
              onClick={login}
            >
              <strong>Đăng nhập</strong>
            </Button>
          </div>
        </div>
        {/* <div className="text-center">
          <a href="#" className="forgot-pw">
            Forgot password?
          </a>
        </div> */}
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default Login;
