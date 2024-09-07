import React, { useEffect, useRef, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import { combineReducers } from "@reduxjs/toolkit";
const localizer = momentLocalizer(moment);

export default function PatientAppointments() {
  const [events, setEvents] = useState([]);
  const { user } = useSelector((state) => state.authReducers);
  const [clickedSlot, setclickedSlot] = useState(null);
  const fetchAllSlots = (doctorId) => {
    fetch(`${BASE_URL}/patient/all-slots`, {
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
            item["title"] = "Dr." + item.openedBy?.name;
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

  useEffect(() => {
    fetchAllSlots();
  }, []);
  const popupRef = useRef();
  const closeRef = useRef();
  const handleBookingOfSlot = (data) => {
    // update the slot details i the clickedSlot state
    setclickedSlot(data);
    // open the popup and popup will read the data from teh same satate
    popupRef.current.click();
  };

  const navigate = useNavigate();
  const startVc = (roomId) => {
    // first close the popup
    closeRef.current.click();
    navigate(`/video-call/${roomId}`);
  };

  function isSameDateAndLaterTime(givenDate) {
    if (!givenDate) return false;
    const now = new Date();

    // Check if the year, month, and date are the same
    const isSameDate =
      now.getFullYear() === givenDate.getFullYear() &&
      now.getMonth() === givenDate.getMonth() &&
      now.getDate() === givenDate.getDate();

    // Check if the current time is later than the given time
    const isLaterTime = now.getTime() > givenDate.getTime();

    // Return true only if both conditions are met
    return isSameDate && isLaterTime;
  }

  return (
    <div style={{marginTop:"3%"}}>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        events={events}
        onSelectEvent={handleBookingOfSlot}
      />

      {/* this is the popup slot over caldernder*/}
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
                  Appointment Details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>These are the details of your appointments</p>

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
                  <button
                    disabled={
                      isSameDateAndLaterTime(clickedSlot?.start) != true
                    }
                    onClick={() => startVc(clickedSlot?.roomId)}
                    class="btn btn-primary"
                  >
                    Join Meet
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref={closeRef}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
