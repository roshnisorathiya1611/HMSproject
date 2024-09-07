import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { loginAction } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./login.css";
export default function Login() {
  const [email, setEmail] = useState("sanket@gmail.com");
  const [password, setPassword] = useState("gdffgsd@344KKK");

  const { authloading, autherror, loginsuccess, user } = useSelector(
    (state) => state.authReducers
  );

  console.log("Login sucess", loginsuccess);
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(loginAction({ email, password }));
  };

  useEffect(() => {
    if (autherror != null) {
      toast.error(autherror);
    }
  }, [autherror]);

  const navigate = useNavigate();
  useEffect(() => {
    if (loginsuccess == true) {
      // redirect to some home page
      if (user && user.role == "doctor") navigate("/doctor-dashboard");
      else if (user && user.role == "patient") navigate("/patient-dashboard");
      else if (user && user.role == "admin") navigate("/admin-dashboard");
    }
  }, [loginsuccess]);

  return (

    <div className="container-fluid">
        <div className="row">
        <div className="brand-wrapper" style={{ textAlign: "center" }}><h3><b>Detailed Introduction of Hospital Management System (HMS)</b></h3></div>
          <div className="col-sm-6 col-md-7 intro-section">
            <div className="intro-content-wrapper">
            </div>
          </div>
          <div className="col-sm-6 col-md-5 form-section">
            <div className="login-wrapper">
              <h2 className="login-title">Login</h2>
              <form action="#!">
                <div className="form-group">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input type="email" value={email} name="email" id="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.currentTarget.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input onChange={(e) => setPassword(e.currentTarget.value)}
                  value={password}
                 type="password" name="password" id="password" className="form-control" placeholder="Password" />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-5">
                <button
                    onClick={handleLogin}
                    disabled={authloading}
                    type="button"
                    className="btn login-btn"
                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  >{authloading ? "Loading..." : "Login"}
                  </button>
                </div>
              </form>           
              <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="link-danger">
                      Register
                    </Link>
                  </p>
            </div>
          </div>
        </div>
      </div>
  );
}
