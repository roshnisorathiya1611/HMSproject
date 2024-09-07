import React, { useContext } from "react";
import { HISContext } from "../../../HISContext";
import "./usercard.css";
export default function UserCard({
  name,
  email,
  pic,
  address,
  bio,
  department,
  fetchSlotsOfaDoctor,
  id,
  isSlotsButtonRequired = true,
}) {
  const { setOption, setReceiver } = useContext(HISContext);

  const redirectToChattingScreen = () => {
    // set the receiver
    setReceiver(id);
    // redirect to the chat screen
    setOption("chats");
  };
  return (
    <div
      style={{ width: "18rem", backgroundColor: "#d5d5d57d" }}
      className="p-2 m-2"
    >
      <div
        className="no-gutters"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          src={pic}
        />
        <div>
          <h4>{name}</h4>
          <p
            className="d-flex text-sm"
            style={{ margin: "0px", alignItems: "center" }}
          >
            <i class="fa-solid fa-envelope"></i>
            {email.substr(0, 23)}
          </p>
          {address && (
            <p className="text-sm">
              <i class="fa-solid fa-location-pin"></i>
              {address?.state} {address?.city}
            </p>
          )}
        </div>
      </div>
      {bio && (
        <p className="font-weight-light">
          {" "}
          <strong>Bio:</strong> {bio}
        </p>
      )}

      {department && (
        <p className="font-weight-light">
          {" "}
          <strong>Department: {department}</strong> {bio}
        </p>
      )}

      <button
        onClick={redirectToChattingScreen}
        className="btn btn-sm btn-primary mx-2"
      >
        Message
      </button>
      {isSlotsButtonRequired == true && (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => fetchSlotsOfaDoctor(id)}
        >
          View Available Slots
        </button>
      )}
    </div>
  );
}
