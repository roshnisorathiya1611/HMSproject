import { useState, useEffect } from "react";
import SignupImage from "../../assets/signup.png";
import { Link } from "react-router-dom";
import { signupAction } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const { autherror, authloading, signupsuccess } = useSelector(
    (state) => state
  );
  const handleSignup = () => {
    dispatch(signupAction({ name, email, password, gender }));
  };

  useEffect(() => {
    if (autherror != null) {
      toast.error(autherror);
    }
  }, [autherror]);

  const navigate = useNavigate();
  useEffect(() => {
    if (signupsuccess == true) {
      // redirect to login  page
      navigate("/");
    }
  }, [signupsuccess]);

  return (
    
    <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 col-md-7">
            <img src={SignupImage} className="img-fluid" alt="Sample image" style={{ height: "75vh" }}/>
            <div className="intro-content-wrapper">
            </div>
          </div>
          <div className="col-sm-6 col-md-5 form-section">
            <div className="login-wrapper">
              <h2 className="login-title">Signup</h2>
              <form>
              <div className="form-group mb-3">
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input onChange={(e) => setName(e.currentTarget.value)}
                  value={name}
                 type="Name" name="Name" id="Name" className="form-control" placeholder="Enter Name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input type="email" value={email} name="email" id="email" className="form-control" placeholder="Enter Email" onChange={(e) => setEmail(e.currentTarget.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input onChange={(e) => setPassword(e.currentTarget.value)}
                  value={password}
                 type="password" name="password" id="password" className="form-control" placeholder="Enter Password" />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="gender" className="sr-only">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.currentTarget.value)}
                    className="form-control"
                    style={{ height: "48px" }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-5">
                <button
                    className="btn login-btn"
                    onClick={handleSignup}
                    type="button"
                    disabled={authloading}
                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                    >
                      {authloading == true ? "Loading..." : "Signup"}
                  </button>
                </div>
              </form>           
              <p className="login-wrapper-footer-text">Don't have an account?{" "} <a href="/" className="text-reset"><b>Login</b></a></p>
            </div>
          </div>
        </div>
      </div>
  );
}
