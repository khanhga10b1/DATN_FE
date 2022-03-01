import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../actions/auth";
import { Redirect } from "react-router-dom";
import { Button, TextField, Spinner, GoogleBtn } from "../../../components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { isAuthenticated, loading, msg } = useSelector((state) => state.auth);

  function login(e) {
    dispatch(loginUser(email, password));
  }

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container-fluid">
      <div className="min-vh-100 flex-column align-items-center justify-content-center">
        <div className="sigin-copyright text-center">
          {/* <img src={''} className='img img-responsive' alt='Responsive image' /> */}
        </div>
        <div className="signinbox bg-white">
          <div className="signin-header text-center">
            <h2 className="widget-title mb-3">Đăng nhập</h2>
          </div>
          <div className="form-group">
            <span style={{ color: "#de1414cf", fontSize: "15px" }}>{msg}</span>
          </div>
          <div className="form-group">
            <label>EMAIL</label>
            <TextField
              placeholder=""
              type="text"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <TextField
              placeholder=""
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <GoogleBtn />

          <div className="form-group">
            <Button
                disabled={!password || !email}
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
