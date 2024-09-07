import React, { useState, useRef, useEffect } from "react";
import "./updateProfile.css";
import {
  updatePasswordAction,
  updateDetailsAction,
  fetchDetails,
} from "../../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
export default function UpdateProfile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { authloading, autherror, user } = useSelector(
    (state) => state.authReducers
  );

  const [phone, setPhone] = useState(user?.phone);
  const [about, setAbout] = useState(user?.about);
  const [city, setCity] = useState(user?.city);
  const [state, setState] = useState(user?.state);
  const [zip, setZip] = useState(user?.zip);
  const [street, setStreet] = useState(user?.street);

  const dispatch = useDispatch();

  const handlePasswordUpdateSubmit = (e) => {
    e.preventDefault();
    if (newPassword == confirmPassword) {
      dispatch(
        updatePasswordAction({
          currentPassword,
          newPassword,
          token: user.token,
        })
      );
    } else {
      toast.error("Password are not matching");
    }
  };

  const handleUpdateDetails = (e) => {
    e.preventDefault();
    dispatch(
      updateDetailsAction({
        phone,
        about,
        street,
        city,
        state,
        zip,
        token: user.token,
      })
    );
  };
  useEffect(() => {
    if (autherror != null && autherror == "Details Updated") {
      toast.success("Details Upated");
      dispatch(fetchDetails({ token: user.token }));
    } else autherror != null;
    {
      toast.error(autherror);
    }
  }, [autherror]);

  const updateProfilePic = (file) => {
    let data = new FormData();
    data.append("profilepic", file);

    fetch(`${BASE_URL}/auth/profile-photo`, {
      method: "POST",
      headers: {
        Authorization: user.token,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Image updated");
          dispatch(fetchDetails({ token: user.token }));
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));
  };

  const inputRef = useRef(null);

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="row mt-5 gutters">
        <div className="col-sm-12 col-xl-6">
          <div className="card h-100">
            <div className="card-body">
              <div >
              <h4 class="mb-4"><b>Change Password</b></h4>
              <hr></hr>
                <div>
                  <form onSubmit={handlePasswordUpdateSubmit}>
                    <div className="form-group my-2">
                      <input
                        onChange={(e) =>
                          setCurrentPassword(e.currentTarget.value)
                        }
                        required
                        type="password"
                        className="form-control"
                        id="phone"
                        placeholder="Old Password"
                      />
                    </div>
                    <div className="form-group my-2">
                      <input
                        onChange={(e) => setNewPassword(e.currentTarget.value)}
                        required
                        type="password"
                        className="form-control"
                        id="phone"
                        placeholder="New Password"
                      />
                      <div className="form-group my-2">
                        <input
                          onChange={(e) =>
                            setConfirmPassword(e.currentTarget.value)
                          }
                          required
                          type="password"
                          className="form-control"
                          id="phone"
                          placeholder="Confirm New Password"
                        />
                      </div>
                      <button
                        disabled={authloading == true}
                        className="btn btn-primary"
                      >
                        {authloading ? "Please Wait..." : "Change Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xl-6">
          <div className="card h-100">
            <form onSubmit={handleUpdateDetails}>
              <div className="card-body">
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h4 class="mb-4"><b>Personal Details</b></h4>
                  </div>
                  <hr></hr>
                  <div className="col-xl-6 my-3 mcol-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        placeholder="Enter full name"
                        value={user?.name}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="eMail">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="eMail"
                        value={user?.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        required
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Enter phone number"
                        value={phone}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="website">About</label>
                      <input
                        onChange={(e) => setAbout(e.currentTarget.value)}
                        required
                        type="text"
                        className="form-control"
                        id="website"
                        placeholder="About You"
                        value={about}
                      />
                    </div>
                  </div>
                </div>
                <div className="row gutters">
                <hr></hr>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h4 class="mb-4"><b>Address</b></h4>
                  </div>
                  <hr></hr>
                  <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="Street">Street</label>
                      <input
                        onChange={(e) => setStreet(e.currentTarget.value)}
                        required
                        type="text"
                        className="form-control"
                        id="Street"
                        placeholder="Enter Street"
                        value={street}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="ciTy">City</label>
                      <input
                        onChange={(e) => setCity(e.currentTarget.value)}
                        required
                        type="name"
                        className="form-control"
                        id="ciTy"
                        placeholder="Enter City"
                        value={city}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="sTate">State</label>
                      <input
                        onChange={(e) => setState(e.currentTarget.value)}
                        required
                        type="text"
                        className="form-control"
                        id="sTate"
                        placeholder="Enter State"
                        value={state}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 my-3 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="zIp">Zip Code</label>
                      <input
                        onChange={(e) => setZip(e.currentTarget.value)}
                        required
                        type="text"
                        className="form-control"
                        id="zIp"
                        placeholder="Zip Code"
                        value={zip}
                      />
                    </div>
                  </div>
                </div>
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="text-right">
                      <button
                        id="submit"
                        name="submit"
                        className="btn btn-primary"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
