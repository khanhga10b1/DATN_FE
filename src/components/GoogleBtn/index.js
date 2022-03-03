import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser } from "../../actions/auth";
import service from "../../service/service";
const CLIENT_ID =
  "441604146686-k7mg4hfmc2n4bpqeal7va2vo6927eqsn.apps.googleusercontent.com";

const GoogleBtn = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const login = (response) => {
    const profile = response.profileObj;
    if (response.accessToken) {
      service
        .get(`/auth/getAccByEmail?email=${profile.email}`)
        .then((res) => {
          if (res.data) {
            dispatch(loginUser(profile.email, profile.googleId));
            return;
          }
          service
            .post("/auth/register", {
              name: `${profile.familyName} ${profile.givenName}`,
              email: profile.email,
              avatar: profile.imageUrl,
              password: profile.googleId,
              linked : true
            })
            .then((res) => {
              dispatch(loginUser(profile.email, profile.googleId));
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleLoginFailure = (response) => {
    console.log(response);
  };
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form-group" style={{ marginTop: "3rem" }}>
      <GoogleLogin
        clientId={CLIENT_ID}
        className="google_btn"
        buttonText="Login with google account"
        onSuccess={login}
        onFailure={handleLoginFailure}
        cookiePolicy={"single_host_origin"}
        responseType="code,token"
      />
    </div>
  );
};
export default GoogleBtn;
