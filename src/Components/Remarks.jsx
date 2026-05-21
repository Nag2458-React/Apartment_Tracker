import React, {
  useEffect,
  useState,
} from "react";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../Firebase";

export const Remarks = () => {

  // ROLE CHECK

  const isAdmin =
    localStorage.getItem(
      "role"
    ) === "admin";

  // FORM STATE

  const [formData, setFormData] =
    useState({
      flatNumber: "",
      ownerName: "",
      billDate: "",
      description: "",
    });

  // REMARKS LIST

  const [
    remarksData,
    setRemarksData,
  ] = useState([]);

  // HANDLE INPUTS

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  // ADD REMARK

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await addDoc(
          collection(
            db,
            "remarks"
          ),
          {
            ...formData,
            status:
              "Pending",
          }
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

        fetchRemarks();

      } catch (error) {

        console.log(error);

      }

    };

  // FETCH REMARKS

  const fetchRemarks =
    async () => {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              "remarks"
            )
          );

        let remarksTemp = [];

        snapshot.forEach(
          (docItem) => {

            remarksTemp.push({
              id: docItem.id,
              ...docItem.data(),
            });

          }
        );

        // SORT BY DATE DESC

        remarksTemp.sort(
          (a, b) =>
            new Date(
              b.billDate
            ) -
            new Date(
              a.billDate
            )
        );

        setRemarksData(
          remarksTemp
        );

      } catch (error) {

        console.log(error);

      }

    };

  // UPDATE STATUS

  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        const remarkRef =
          doc(
            db,
            "remarks",
            id
          );

        await updateDoc(
          remarkRef,
          {
            status:
              status,
          }
        );

        fetchRemarks();

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchRemarks();

  }, []);

  return (

    <div className="container mt-5 mb-5">

      {/* USER FORM */}

      {
        !isAdmin && (

          <div
            className="card p-4 shadow mb-5"
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

        )
      }

      {/* ADMIN TABLE */}

      {
        isAdmin && (

          <div
            className="card shadow-lg border-0 rounded-4 p-4"
            style={{
              background:
                "rgba(0,0,0,0.7)",
            }}
          >

            <h3 className="text-white mb-4">

              Suggestions / Remarks List

            </h3>

            <div className="table-responsive">

              <table className="table table-bordered table-hover text-center align-middle">

                <thead className="table-dark">

                  <tr>

                    <th>
                      S.No
                    </th>

                    <th>
                      Flat Number
                    </th>

                    <th>
                      Owner Name
                    </th>

                    <th>
                      Suggestion / Remark
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    remarksData.length >
                    0 ? (

                      remarksData.map(
                        (
                          item,
                          index
                        ) => (

                          <tr
                            key={
                              item.id
                            }
                          >

                            <td>

                              {
                                index + 1
                              }

                            </td>

                            <td>

                              {
                                item.flatNumber
                              }

                            </td>

                            <td>

                              {
                                item.ownerName
                              }

                            </td>

                            <td>

                              {
                                item.description
                              }

                            </td>

                            <td>

                              {
                                item.billDate
                              }

                            </td>

                            <td>

                              <span
                                className={
                                  item.status ===
                                  "Clear"
                                    ? "badge bg-success"
                                    : "badge bg-warning text-dark"
                                }
                              >

                                {
                                  item.status
                                }

                              </span>

                            </td>

                            <td>

                              {
                                item.status ===
                                "Pending" ? (

                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                      updateStatus(
                                        item.id,
                                        "Clear"
                                      )
                                    }
                                  >

                                    Mark Clear

                                  </button>

                                ) : (

                                  <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() =>
                                      updateStatus(
                                        item.id,
                                        "Pending"
                                      )
                                    }
                                  >

                                    Mark Pending

                                  </button>

                                )
                              }

                            </td>

                          </tr>

                        )
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan={7}
                          className="text-danger fw-bold"
                        >

                          No Remarks Found

                        </td>

                      </tr>

                    )
                  }

                </tbody>

              </table>

            </div>

          </div>

        )
      }

    </div>

  );

};