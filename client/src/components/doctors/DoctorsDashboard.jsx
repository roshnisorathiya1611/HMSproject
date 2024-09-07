import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import UpdateProfile from "../common/UpdateProfile/UpdateProfile";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { HISContext } from "../../HISContext";
import PatientTab from "./PatientsTab";
import DoctorAppointment from "./DoctorAppointment";
import Chat from "../chats/Chat";
import "react-big-calendar/lib/css/react-big-calendar.css";
export default function DoctorsDashboard() {
  const { user } = useSelector((state) => state.authReducers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setOption, option } = useContext(HISContext);

  return (

<div>
      <div className="content">
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0" style={{marginLeft: "19%",marginRight: "2%",
    marginTop: "1%"}}>
        <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
          <h2 className="text-primary mb-0"><i className="fa fa-hashtag" /></h2>
        </a>
        <a className="sidebar-toggler flex-shrink-0">
          <i className="fa fa-bars" />
        </a>
        <form className="d-none d-md-flex ms-4">
          <input className="form-control border-0" type="search" placeholder="Search" />
        </form>
        <div className="navbar-nav align-items-center ms-auto">
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            <img
                src={user?.profilePic}
                alt=""
                width={40}
                height={40}
                className="rounded-circle me-lg-2"
              />
              <span className="d-none d-lg-inline-flex">{user?.name}</span>
            </a>
            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
              <a href="#" className="dropdown-item" onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}>Log Out</a>
                  <a className="dropdown-item">{user?.email}</a>
            </div>
          </div>
        </div>
      </nav>
      <div className="row" style={{marginTop:"-4%",backgroundColor:"#f3f6f9"}}>
        <div
          className="col-4 d-flex flex-column flex-shrink-0 p-3 text-dark bg-light"
          style={{ width: 280, height: "92vh", margin: 0, padding: 0 }}
        >
          <a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <span className="fs-4"><img
                src="https://seeklogo.com/images/H/hms-logo-6FC6E7E493-seeklogo.com.png"
                alt=""
                width={150}
                height={50}
                className="me-lg-2"
              /></span>
          </a>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li onClick={() => setOption("appointments")}>
              <a className="nav-item nav-link text-dark" aria-current="page" href="#">
                Appointments
              </a>
            </li>
            <li onClick={() => setOption("patients")}>
              <a className="nav-item nav-link text-dark" href="#">
              Patients
              </a>
            </li>
            <li>
              <a
                onClick={() => setOption("chats")}
                className="nav-item nav-link text-dark"
                href="#"
              >
                Chats
              </a>
            </li>
            <li onClick={() => setOption("updateprofile")}>
              <a className="nav-item nav-link text-dark" href="#">
                Profile
              </a>
            </li>
          </ul>
        </div>
        <div className="col" style={{ margin: 0, padding: 0 ,marginTop:"2%",maginLeft:"2%"}}>
        {option == "updateprofile" && <UpdateProfile />}
          {option == "patients" && <PatientTab />}
          {option == "appointments" && <DoctorAppointment />}
          {option == "chats" && <Chat />}
        </div>
      </div>
    </div>
    </div>
  );
}
