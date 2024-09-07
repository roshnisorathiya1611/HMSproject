import React, { useEffect, useState, useRef } from "react";
import UserCard from "../common/UserCard/UserCard";
import {
  getAllDepartmentsAction,
  filterDoctors,
  getAllDoctorsAction,
} from "../../redux/slices/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
const localizer = momentLocalizer(moment);
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
export default function DoctorsTab() {
  const { doctors, departments, loading, error } = useSelector(
    (state) => state.patientReducer
  );
  const { user } = useSelector((state) => state.authReducers);

  const dispatch = useDispatch();

  // fetch all the doctors and departments whenenver anyone is coming in the website
  useEffect(() => {
    dispatch(getAllDoctorsAction({ token: user.token }));
    dispatch(getAllDepartmentsAction({ token: user.token }));
  }, []);

  // two state to stro the form data
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("all");

  const handleFilter = (e) => {
    e.preventDefault();
    console.log(name, department);
    dispatch(
      filterDoctors({ name, departmentId: department, token: user.token })
    );
  };

  const [events, setEvents] = useState([]);
  const fetchSlotsOfaDoctor = (doctorId) => {
    fetch(`${BASE_URL}/patient/doctor-slots/${doctorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          let temp = [];
          for (let item of data.slots) {
            item["title"] = item.isBooked ? "Booked" : "Available";
            item["allDay"] = false;
            item["start"] = new Date(item["start"]);
            item["end"] = new Date(item["end"]);
            temp.push(item);
          }
          setEvents(temp);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const [clickedSlot, setclickedSlot] = useState(null);
  const popupRef = useRef();
  const closeButtonRef = useRef();

  const handleBookingOfSlot = (data) => {
    // 1. update the slot details i nthe clickedSlot state
    setclickedSlot(data);
    // 2. open the popup and popup will read the data from teh same satate
    popupRef.current.click();
  };

  const bookSlot = () => {
    fetch(`${BASE_URL}/patient/book-slot/${clickedSlot._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Slot is Booked");
          closeButtonRef.current.click();
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="mt-4 container">
      <div className="row">
        <div className="col-md-12">
          <h2>Doctors</h2>
        </div>
      </div>
      <form onSubmit={handleFilter}>
        <div className="row">
          <div className="col-md-5">
            <div className="form-group">
              <label>Search by Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          </div>
          <div className="row">
          <div className="col-md-5">
            <div className="form-group">
              <label>Filter by Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.currentTarget.value)}
                className="form-control"
              >
                <option value="all">All Departments</option>
                {departments.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                ))}

                {/* Add more departments here */}
              </select>
            </div>
          </div>
          </div>
          <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <button class="btn btn-primary mt-3">Apply Filter</button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <button
                onClick={() => {
                  setName("");
                  setDepartment("all");
                  dispatch(getAllDoctorsAction({ token: user.token }));
                }}
                type="button"
                class="btn btn-primary mt-3"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
      <hr />
      <div className="row">
        <div class="col col-4">
          {doctors.length == 0 && (
            <p className="text-center">No doctors found !</p>
          )}
          {doctors.map((item, index) => (
            <div key={index}>
              <UserCard
                bio={item.about}
                name={item.name}
                email={item.email}
                address={item?.address}
                pic={item.profilePic}
                department={item?.deparmentId?.name}
                fetchSlotsOfaDoctor={fetchSlotsOfaDoctor}
                id={item._id}
              />
            </div>
          ))}
        </div>
        </div>
        <hr></hr>
        <div className="row">
        <div class="col col-12">
          <h3 class="text-center">Available Slot of Doctors</h3>
          <Calendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            events={events}
            onSelectEvent={handleBookingOfSlot}
            style={{height:"200%"}}
          />
        </div>
      </div>

      {/* this is the popup that will open if you click on any empty slot over caldernder*/}
      <>
        {/* Button trigger modal */}
        <button
          style={{ display: "none" }}
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          ref={popupRef}
        >
          Launch demo modal
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Doctor Slot Details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>Please verify the booking details</p>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    {" "}
                    <b>Start Date</b> : {clickedSlot?.start.toDateString()}{" "}
                  </p>
                  <p>
                    {" "}
                    <b>Start Time</b>: {clickedSlot?.start.toLocaleTimeString()}
                  </p>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    {" "}
                    <b>End Date</b> : {clickedSlot?.end.toDateString()}{" "}
                  </p>
                  <p>
                    {" "}
                    <b>End Time</b>: {clickedSlot?.end.toLocaleTimeString()}
                  </p>
                </div>
                <hr />
                <div style={{ display: "flex", gap: "10px" }}>
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    src={clickedSlot?.openedBy?.profilePic}
                  />
                  <div>
                    <h4 style={{ margin: "0px" }}>
                      {clickedSlot?.openedBy?.name}
                    </h4>
                    <p
                      className="d-flex text-sm"
                      style={{ margin: "0px", alignItems: "center" }}
                    >
                      <i class="fa-solid fa-envelope"></i>
                      {clickedSlot?.openedBy?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref={closeButtonRef}
                >
                  Close
                </button>
                <button
                  onClick={bookSlot}
                  type="button"
                  className="btn btn-primary"
                >
                  Book Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
