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
  deleteDoc,
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

  // REMARKS DATA

  const [
    remarksData,
    setRemarksData,
  ] = useState([]);

  const [
    filteredData,
    setFilteredData,
  ] = useState([]);

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState("");

  // CURRENT DATE

  const currentDate =
    new Date();

  const currentMonth =
    currentDate.getMonth() + 1;

  const currentYear =
    currentDate.getFullYear();

  // HANDLE INPUT

  const handleChange = (
    e
  ) => {

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

        // SORT FLAT NUMBER

        remarksTemp.sort(
          (a, b) =>
            Number(
              a.flatNumber
            ) -
            Number(
              b.flatNumber
            )
        );

        setRemarksData(
          remarksTemp
        );

        // DEFAULT CURRENT MONTH DATA

        const currentMonthData =
          remarksTemp.filter(
            (item) => {

              if (
                !item.billDate
              )
                return false;

              const billDate =
                new Date(
                  item.billDate
                );

              return (
                billDate.getMonth() + 1 ===
                  currentMonth &&
                billDate.getFullYear() ===
                  currentYear
              );

            }
          );

        setFilteredData(
          currentMonthData
        );

      } catch (error) {

        console.log(error);

      }

    };

  // MONTH FILTER

  const handleMonthChange =
    (e) => {

      const value =
        e.target.value;

      setSelectedMonth(
        value
      );

      // CURRENT MONTH

      if (!value) {

        const currentMonthData =
          remarksData.filter(
            (item) => {

              if (
                !item.billDate
              )
                return false;

              const billDate =
                new Date(
                  item.billDate
                );

              return (
                billDate.getMonth() + 1 ===
                  currentMonth &&
                billDate.getFullYear() ===
                  currentYear
              );

            }
          );

        setFilteredData(
          currentMonthData
        );

        return;

      }

      // SELECTED MONTH

      const [
        year,
        month,
      ] = value.split("-");

      const filtered =
        remarksData.filter(
          (item) => {

            if (
              !item.billDate
            )
              return false;

            const billDate =
              new Date(
                item.billDate
              );

            const billMonth =
              String(
                billDate.getMonth() + 1
              ).padStart(
                2,
                "0"
              );

            const billYear =
              billDate
                .getFullYear()
                .toString();

            return (
              billMonth ===
                month &&
              billYear ===
                year
            );

          }
        );

      setFilteredData(
        filtered
      );

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

  // DELETE REMARK

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure want to delete?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(
            db,
            "remarks",
            id
          )
        );

        alert(
          "Deleted Successfully"
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
          >

            <h3 className="text-center mb-4 text-black">

              Add Remarks

            </h3>

            <form onSubmit={handleSubmit}>

              <div className="row">

                <div className="col-md-4 mb-3">

                  <label className="text-black">

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

                  <label className="text-black">

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

                  <label className="text-black">

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

                  <label className="text-black">

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
                    placeholder="Enter Any Issues Or Suggestions in the Apartment"
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
          >

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

              <h3 className="text-black">

                Suggestions / Remarks List

              </h3>

              <div>

                <input
                  type="month"
                  className="form-control"
                  value={
                    selectedMonth
                  }
                  onChange={
                    handleMonthChange
                  }
                />

              </div>

            </div>

            <div className="table-responsive rem">

              <table className="table table-bordered table-hover text-center align-middle">

                <thead className="table-dark1">

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
                    filteredData.length >
                    0 ? (

                      filteredData.map(
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

                              <div className="d-flex justify-content-center gap-2 flex-wrap">

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

                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    handleDelete(
                                      item.id
                                    )
                                  }
                                >

                                  Delete

                                </button>

                              </div>

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