import React, { useRef, useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useSelector } from "react-redux";
const localizer = momentLocalizer(moment);
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
export default function DoctorAppointment() {
  const buttonRef = useRef();
  const [clickedSlot, setClickedSlot] = useState(null);
  const { user } = useSelector((state) => state.authReducers);
  const [events, setEvents] = useState([]);
  const callOpenSlotAPI = () => {
    fetch(`${BASE_URL}/doctor/open-slot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
      body: JSON.stringify({
        start: clickedSlot.start,
        end: clickedSlot.end,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        closeButtonRef.current.click();
        if (data.success) {
          toast.success("Slot opened successfully");
          fetchAllSlots();
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const opentSlot = (data) => {
    // 1. update the data of this slot in the clickedSlot state
    setClickedSlot(data);
    // 2. Open the popup
    buttonRef.current.click();
  };

  const fetchAllSlots = () => {
    fetch(`${BASE_URL}/doctor/all-slots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // modify the data given by api to add the extra fiels
        let temp = [];
        for (let item of data.slots) {
          item["title"] = item.isBooked ? item.bookedBy.name : "Available";
          item["allDay"] = false;
          item["start"] = new Date(item["start"]);
          item["end"] = new Date(item["end"]);
          temp.push(item);
        }
        setEvents(temp);
      })
      .catch((err) => toast.error(err.message));
  };

  const closeButtonRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllSlots();
  }, []);

  // new references for new popup
  const newBtnRef = useRef();
  const newcloseRef = useRef();
  const [currentSelectedEvent, setCurrentSelectedEvent] = useState(null);
  const getEventDetails = (data) => {
    // first i will update teh currentSelectedEvent state
    setCurrentSelectedEvent(data);
    // then i will opne the new popup that will read this state to get details to show on the UI
    newBtnRef.current.click();
  };

  const startVc = (roomId) => {
    // first close the popup
    newcloseRef.current.click();
    navigate(`/video-call/${roomId}`);
  };

  function isSameDateAndLaterTime(givenDate) {
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

  const deleteSlot = () => {
    fetch(`${BASE_URL}/doctor/delete-slot/${currentSelectedEvent._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        newcloseRef.current.click();
        if (data.success) {
          toast.success("Slot Deleted");
          fetchAllSlots();
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500,marginTop:"4%" }}
        selectable={true}
        events={events}
        onSelectSlot={opentSlot}
        onSelectEvent={getEventDetails}
        eventPropGetter={(event) => {
          const backgroundColor = event.isBooked ? "red" : "green";
          return { style: { backgroundColor } };
        }}
      />

      {/* this is the popup that will open if you click on any empty slot over caldernder*/}
      <>
        {/* Button trigger modal */}
        <button
          style={{ display: "none" }}
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          ref={buttonRef}
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
                  Add Slot Details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>Please verify the slot details</p>

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
                  onClick={callOpenSlotAPI}
                  type="button"
                  className="btn btn-primary"
                >
                  Open Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </>

      {/* this is the popup that will open if you click on any present event over caldernder*/}

      <>
        {/* Button trigger modal */}
        <button
          style={{ display: "none" }}
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#newpopup"
          ref={newBtnRef}
        >
          Launch demo modal
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id="newpopup"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Your slot details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>Following are your slot details</p>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    {" "}
                    <b>Start Date</b> :{" "}
                    {currentSelectedEvent?.start.toDateString()}{" "}
                  </p>
                  <p>
                    {" "}
                    <b>Start Time</b>:{" "}
                    {currentSelectedEvent?.start.toLocaleTimeString()}
                  </p>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    {" "}
                    <b>End Date</b> : {currentSelectedEvent?.end.toDateString()}{" "}
                  </p>
                  <p>
                    {" "}
                    <b>End Time</b>:{" "}
                    {currentSelectedEvent?.end.toLocaleTimeString()}
                  </p>
                </div>
                {currentSelectedEvent?.isBooked && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                      src={currentSelectedEvent?.bookedBy?.profilePic}
                    />
                    <div>
                      <h4 style={{ margin: "0px" }}>
                        {currentSelectedEvent?.bookedBy?.name}
                      </h4>
                      <p
                        className="d-flex text-sm"
                        style={{ margin: "0px", alignItems: "center" }}
                      >
                        <i class="fa-solid fa-envelope"></i>
                        {currentSelectedEvent?.bookedBy?.email}
                      </p>
                    </div>
                    <button
                      disabled={
                        isSameDateAndLaterTime(currentSelectedEvent?.start) !=
                        true
                      }
                      onClick={() => startVc(currentSelectedEvent?.roomId)}
                      class="btn btn-primary"
                    >
                      Start Meet
                    </button>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref={newcloseRef}
                >
                  Close
                </button>
                <button
                  onClick={deleteSlot}
                  type="button"
                  className="btn btn-danger"
                >
                  Delete Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
