import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PatientDashboard from "./components/patients/PatientDashboard";
import { Route, Routes } from "react-router-dom";
import PatientProtectedWrapper from "./components/auth/PatientProtectedWrapper";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { HISContext } from "./HISContext";
import { useState, useEffect } from "react";
import DoctorsDashboard from "./components/doctors/DoctorsDashboard";
import DoctorProtectedWrapper from "./components/auth/DoctorProtectedWrapper";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "./socket";
import VideoCall from "./components/common/VideoCall";
import LoginWrapper from "./components/auth/LogginWrapper";
import { BASE_URL } from "./config";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProtectedWrapper from "./components/auth/AdminProtectedWrapper";
function App() {
  const [option, setOption] = useState("updateprofile");
  const { user } = useSelector((state) => state.authReducers);
  const [patients, setPatients] = useState([]);
  const fetchAllPatients = () => {
    fetch(`${BASE_URL}/doctor/all-patients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPatients(data.patients);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const filterPatients = (query) => {
    fetch(`${BASE_URL}/doctor/search-patients?query=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPatients(data.patients);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  // ************ chat logic *****************
  const [chatUsers, setChatUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  // funciton to fetch all the chat users
  const fetchChatUsers = () => {
    let url = "";
    if (user.role == "doctor") {
      url = `${BASE_URL}/doctor/all-patients`;
    } else if (user.role == "patient") {
      url = `${BASE_URL}/patient/all-doctors`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (user.role == "doctor") {
          setChatUsers(data.patients);
        } else if (user.role == "patient") {
          setChatUsers(data.doctors);
        }
      })
      .catch((err) => console.log(err));
  };

  const sendMessage = (message) => {
    socket.emit("send-message", {
      sender: user._id,
      receiver: receiver,
      message: message,
    });
  };
  const sendFile = (file) => {
    console.log("Sending file", file);
    socket.emit("send-file", {
      sender: user._id,
      receiver: receiver,
      file: file,
      filename: file.name,
    });
  };
  useEffect(() => {
    if (user) {
      socket.connect();
      fetchChatUsers();
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (user && receiver) {
      let combinedId = "";
      if (user._id > receiver) {
        combinedId = user._id + receiver;
      } else {
        combinedId = receiver + user._id;
      }
      // fetch the initial messages of you and receiver
      fetchAllMessages();
      // set the listener to listen for events
      socket.on(combinedId, (payload) => {
        console.log("Recived", payload);
        setMessages((state) => [...state, payload]);
      });

      return () => {
        socket.removeListener(combinedId);
      };
    }
  }, [user, receiver]);

  const fetchAllMessages = () => {
    fetch(`${BASE_URL}/auth/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token,
      },
      body: JSON.stringify({
        receiverId: receiver,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
      })
      .catch((err) => console.log(err));
  };
  console.log(receiver);
  return (
    <div>
      <HISContext.Provider
        value={{
          option,
          setOption,
          fetchAllPatients,
          patients,
          filterPatients,
          chatUsers,
          setReceiver,
          receiver,
          sendMessage,
          messages,
          sendFile,
        }}
      >
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/patient-dashboard"
            element={
              <PatientProtectedWrapper>
                <PatientDashboard />
              </PatientProtectedWrapper>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <DoctorProtectedWrapper>
                <DoctorsDashboard />
              </DoctorProtectedWrapper>
            }
          />
          <Route
            path="/video-call/:roomId"
            element={
              <LoginWrapper>
                <VideoCall />
              </LoginWrapper>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedWrapper>
                <AdminDashboard />
              </AdminProtectedWrapper>
            }
          />
        </Routes>
      </HISContext.Provider>
    </div>
  );
}

export default App;
