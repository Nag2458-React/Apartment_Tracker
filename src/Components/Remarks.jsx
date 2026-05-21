import React, { useState } from "react";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "../Firebase";

export const Remarks = () => {

  const [formData, setFormData] =
    useState({
      flatNumber: "",
      ownerName: "",
      billDate: "",
      description: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addDoc(
        collection(
          db,
          "remarks"
        ),
        formData
      );

      alert(
        "Remark Added Successfully"
      );

      setFormData({
        flatNumber: "",
        ownerName: "",
        billDate: "",
        description: "",
      });

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="container mt-5">

      <div
        className="card p-4 shadow"
        style={{
          background:
            "transparent",
          border:
            "1px solid #ffffff8c",
        }}
      >

        <h3 className="text-center mb-4 text-white">

          Add Remarks

        </h3>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="col-md-4 mb-3">

              <label className="text-white">
                Flat Number
              </label>

              <input
                className="form-control"
                type="text"
                name="flatNumber"
                placeholder="Flat Number"
                value={
                  formData.flatNumber
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label className="text-white">
                Owner Name
              </label>

              <input
                className="form-control"
                type="text"
                name="ownerName"
                placeholder="Owner Name"
                value={
                  formData.ownerName
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label className="text-white">
                Remarks Date
              </label>

              <input
                className="form-control"
                type="date"
                name="billDate"
                value={
                  formData.billDate
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="col-md-12 mb-3">

              <label className="text-white">
                Enter Suggestions / Remarks
              </label>

              <textarea
                rows={3}
                className="form-control"
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Enter Remarks"
                required
              ></textarea>

            </div>

            <div className="col-md-12 text-center">

              <button className="btn btn-success">

                Submit

              </button>

            </div>

          </div>

        </form>

      </div>

    </div>

  );

};