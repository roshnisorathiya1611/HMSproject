import React, { useContext, useEffect, useState } from "react";
import { HISContext } from "../../HISContext";
import UserCard from "../common/UserCard/UserCard";

export default function PatientTab() {
  // two state to stro the form data
  const [query, setQuery] = useState("");

  const { patients, fetchAllPatients, filterPatients } = useContext(HISContext);
  const handleFilter = (e) => {
    e.preventDefault();
    filterPatients(query);
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  return (
    <div className="mt-4 container">
      <div className="row">
        <div className="col-md-12">
          <h2>Patients</h2>
        </div>
      </div>
      <form onSubmit={handleFilter}>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>Search by Name or Email</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                type="text"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <button class="btn btn-primary mt-3">Apply Filter</button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <button
                onClick={() => {
                  setQuery("");
                  fetchAllPatients();
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
        {patients.length == 0 && (
          <p className="text-center">No Patients found !</p>
        )}
        {patients.map((item, index) => (
          <div key={index} className="col col-4">
            <UserCard
              bio={item.about}
              name={item.name}
              email={item.email}
              address={item?.address}
              pic={item.profilePic}
              isSlotsButtonRequired={false}
              id={item._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
