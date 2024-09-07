import React, { useContext, useRef, useState, useEffect } from "react";
import ClipImage from "../../assets/clip.png";
import { useSelector } from "react-redux";
import "./chat.css";
import LeftCard from "./LeftCard";

import { HISContext } from "../../HISContext";

export default function Chat() {
  const [message, setMessage] = useState("");

  const { chatUsers, sendMessage, messages, sendFile } = useContext(HISContext);
  const { user } = useSelector((state) => state.authReducers);

  const fileRef = useRef(null);

  const giveNameOfFileFromUrl = (url) => {
    url = url.split("/");
    return url[url.length - 1];
  };
  return (
    <div className="container-fluid" style={{ margin: "0", padding: "0",marginTop:"4%" }}>
      <div className="inbox_people">
        <div className="headind_srch">
          <div className="recent_heading">
            <h4>Chats</h4>
          </div>
        </div>
        <div className="inbox_chat">
          {chatUsers.map((item, index) => {
            return (
              <LeftCard
                name={item.name}
                imgUrl={item.profilePic}
                _id={item._id}
                key={item._id}
              />
            );
          })}
        </div>
      </div>
      <div className="mesgs">
        <div className="msg_history">
          {messages.map((message, index) => {
            if (message.sender._id == user._id) {
              return (
                <div key={index} className="outgoing_msg">
                  <div className="sent_msg">
                    {message.file == true ? (
                      <div className="bg-warning p-2">
                        <a
                          href={message.message}
                          style={{ textDecoration: "none" }}
                        >
                          {" "}
                          <i class="fa-solid fa-download"></i>{" "}
                          {giveNameOfFileFromUrl(message.message)}
                        </a>
                      </div>
                    ) : (
                      <p>{message.message}</p>
                    )}
                    <span className="time_date">
                      {" "}
                      {new Date(message.createdAt).toLocaleString()}
                    </span>{" "}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="incoming_msg">
                  <div className="incoming_msg_img">
                    {" "}
                    <img
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                      src={message.sender.profilePic}
                      alt="sunil"
                    />{" "}
                  </div>
                  <div className="received_msg">
                    <div className="received_withd_msg">
                      {message.file == true ? (
                        <div className="bg-warning p-2">
                          <a
                            href={message.message}
                            style={{ textDecoration: "none" }}
                          >
                            {" "}
                            <i class="fa-solid fa-download"></i>{" "}
                            {giveNameOfFileFromUrl(message.message)}
                          </a>
                        </div>
                      ) : (
                        <p>{message.message}</p>
                      )}

                      <span className="time_date">
                        {" "}
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          })}

          <div></div>
        </div>
        <div className="type_msg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(message);
              setMessage("");
            }}
          >
            <div className="input_msg_write">
              <input
                onChange={(e) => setMessage(e.currentTarget.value)}
                value={message}
                type="text"
                className="write_msg"
                placeholder="Type a message"
              />
              <button
                onClick={() => fileRef.current.click()}
                className="msg_send_btn"
                type="button"
              >
                <img width="50px" src={ClipImage} />
              </button>

              <input
                onChange={(e) => sendFile(e.currentTarget.files[0])}
                ref={fileRef}
                style={{ display: "none" }}
                type="file"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
