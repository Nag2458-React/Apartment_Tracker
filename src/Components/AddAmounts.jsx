import React, {
  useEffect,
  useState,
} from "react";

import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../Firebase";

import { toast } from "react-toastify";

const AddAmounts = () => {

  const [form, setForm] = useState({
    flatNumber: "",
    ownerName: "",
    billDate: "",
    maintenanceAmount: "",
    Description: "",
  });

  const [data, setData] =
    useState([]);

  const [filteredData, setFilteredData] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [editData, setEditData] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 5;

  // MONTH NAME

  const currentDate =
    new Date();

  const currentMonthName =
    currentDate.toLocaleString(
      "default",
      {
        month: "long",
      }
    );

  const currentYear =
    currentDate.getFullYear();

  // HANDLE CHANGE

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ADD DATA

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addDoc(
        collection(
          db,
          "flat_amounts"
        ),
        form
      );

      toast.success(
        "Data Added Successfully"
      );

      setForm({
        flatNumber: "",
        ownerName: "",
        billDate: "",
        maintenanceAmount: "",
        Description: "",
      });

      fetchData();

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed To Add Data"
      );
    }
  };

  // FETCH DATA

  const fetchData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(
            db,
            "flat_amounts"
          )
        );

      const tempData = [];

      querySnapshot.forEach(
        (doc) => {

          tempData.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      );

      setData(tempData);

      filterMonthData(
        tempData,
        selectedMonth
      );

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // FILTER MONTH DATA

  const filterMonthData = (
    allData,
    monthValue
  ) => {

    let filtered = [];

    // SELECTED MONTH

    if (monthValue) {

      filtered = allData.filter(
        (item) => {

          if (!item.billDate)
            return false;

          const billDate =
            new Date(
              item.billDate
            );

          const itemMonth =
            `${billDate.getFullYear()}-${String(
              billDate.getMonth() +
                1
            ).padStart(
              2,
              "0"
            )}`;

          return (
            itemMonth ===
            monthValue
          );
        }
      );

    } else {

      // CURRENT MONTH

      const currentMonth =
        currentDate.getMonth();

      const currentYear =
        currentDate.getFullYear();

      filtered = allData.filter(
        (item) => {

          if (!item.billDate)
            return false;

          const billDate =
            new Date(
              item.billDate
            );

          return (
            billDate.getMonth() ===
              currentMonth &&
            billDate.getFullYear() ===
              currentYear
          );
        }
      );
    }

    setFilteredData(filtered);
  };

  // MONTH CHANGE

  const handleMonthChange = (e) => {

    const value =
      e.target.value;

    setSelectedMonth(value);

    filterMonthData(
      data,
      value
    );

    setCurrentPage(1);
  };

  // DELETE

  const handleDelete = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure want to delete?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(
          db,
          "flat_amounts",
          id
        )
      );

      toast.success(
        "Deleted Successfully"
      );

      fetchData();

    } catch (error) {

      console.log(error);

      toast.error(
        "Delete Failed"
      );
    }
  };

  // EDIT

  const handleEdit = (item) => {

    setEditData(item);
  };

  // UPDATE

  const handleUpdate =
    async () => {

      try {

        const updateRef =
          doc(
            db,
            "flat_amounts",
            editData.id
          );

        await updateDoc(
          updateRef,
          {
            flatNumber:
              editData.flatNumber,
            ownerName:
              editData.ownerName,
            billDate:
              editData.billDate,
            maintenanceAmount:
              editData.maintenanceAmount,
            Description:
              editData.Description,
          }
        );

        toast.success(
          "Updated Successfully"
        );

        setEditData(null);

        fetchData();

      } catch (error) {

        console.log(error);

        toast.error(
          "Update Failed"
        );
      }
    };

  // SEARCH FILTER

  const searchedData =
    filteredData.filter(
      (item) =>
        item.ownerName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.flatNumber
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // PAGINATION

  const lastIndex =
    currentPage *
    recordsPerPage;

  const firstIndex =
    lastIndex -
    recordsPerPage;

  const currentRecords =
    searchedData.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      searchedData.length /
        recordsPerPage
    );

  return (
    <div className="container mt-5 mb-5">

      {/* ADD FORM */}

      <div
        className="card p-4 shadow"
     
      >

        <h3 className="text-center mb-4 text-black">

          Add Flat Amounts

        </h3>

        <form
          onSubmit={handleSubmit}
        >

          <div className="row">

            <div className="col-md-3 mb-3">

              <label>
                Flat Number
              </label>

              <input
                className="form-control"
                type="text"
                name="flatNumber"
                placeholder="Flat Number"
                value={
                  form.flatNumber
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="col-md-3 mb-3">

              <label>
                Owner Name
              </label>

              <input
                className="form-control"
                type="text"
                name="ownerName"
                placeholder="Owner Name"
                value={
                  form.ownerName
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="col-md-3 mb-3">

              <label>
                Bill Date
              </label>

              <input
                className="form-control"
                type="date"
                name="billDate"
                value={
                  form.billDate
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="col-md-3 mb-3">

              <label>
                Maintenance Amount
              </label>

              <input
                className="form-control"
                type="number"
                name="maintenanceAmount"
                placeholder="Leave '0' Pending"
                value={
                  form.maintenanceAmount
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="col-md-12 mb-3">

              <label>
                Description
              </label>

              <textarea
                className="form-control"
                name="Description"
                placeholder="Maintenance Description"
                value={
                  form.Description
                }
                onChange={
                  handleChange
                }
              ></textarea>

            </div>

            <div className="col-md-12 mt-3">

              <div className="text-center">

                <button className="btn btn-success px-5">

                  Submit

                </button>

              </div>

            </div>

          </div>

        </form>

      </div>

      {/* TABLE CARD */}

      <div className="card shadow p-4 mt-5">

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">

          <h4 className="fw-bold">

            {selectedMonth
              ? "Selected Month Data"
              : `${currentMonthName}-${currentYear} Maintenance Data`}

          </h4>

          <div className="d-flex gap-3 flex-wrap">

            {/* MONTH PICKER */}

            <input
              type="month"
              className="form-control"
              style={{
                width: "220px",
              }}
              value={
                selectedMonth
              }
              onChange={
                handleMonthChange
              }
            />

            {/* SEARCH */}

            <input
              type="text"
              className="form-control"
              placeholder="Search Flat / Owner"
              style={{
                width: "220px",
              }}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="table-responsive">

          <table className="table table-bordered table-striped align-middle">

            <thead className="table-dark1">

              <tr>

                <th>S.No</th>

                <th>Flat No</th>

                <th>Owner Name</th>

                <th>Bill Date</th>

                <th>Status</th>

                <th>Maintenance</th>

                <th>Description</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {currentRecords.length >
              0 ? (

                currentRecords.map(
                  (
                    item,
                    index
                  ) => {

                    const amount =
                      Number(
                        item.maintenanceAmount
                      );

                    return (

                      <tr
                        key={
                          item.id
                        }
                      >

                        <td>
                          {firstIndex +
                            index +
                            1}
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
                            item.billDate
                          }
                        </td>

                        {/* STATUS */}

                        <td>

                          {amount ===
                          0 ? (

                            <span className="badge bg-danger">

                              Pending

                            </span>

                          ) : (

                            <span className="badge bg-success">

                              Paid

                            </span>

                          )}

                        </td>

                        {/* AMOUNT */}

                        <td>

                          {amount ===
                          0 ? (

                            <span className="text-danger fw-bold">

                              Pending

                            </span>

                          ) : (

                            <span className="text-success fw-bold">

                              ₹
                              {
                                item.maintenanceAmount
                              }

                            </span>

                          )}

                        </td>

                        <td>
                          {
                            item.Description
                          }
                        </td>

                        <td>

                          <button
                            className="btn btn-primary btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#editModal"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                          >

                            Edit

                          </button>

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

                        </td>

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center text-danger fw-bold"
                  >

                    No Data Found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="d-flex justify-content-center mt-4 flex-wrap">

          {[
            ...Array(
              totalPages
            ),
          ].map(
            (_, index) => (

              <button
                key={index}
                className={`btn mx-1 mb-2 ${
                  currentPage ===
                  index + 1
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
              >

                {index + 1}

              </button>
            )
          )}

        </div>

      </div>

      {/* EDIT MODAL */}

      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
      >

        <div className="modal-dialog modal-lg">

          <div className="modal-content">

            <div className="modal-header">

              <h5 className="modal-title">

                Edit Amount Details

              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>

            <div className="modal-body">

              {editData && (

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label>
                      Flat Number
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        editData.flatNumber
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          flatNumber:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label>
                      Owner Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        editData.ownerName
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          ownerName:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label>
                      Bill Date
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      value={
                        editData.billDate
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          billDate:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label>
                      Maintenance Amount
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      value={
                        editData.maintenanceAmount
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          maintenanceAmount:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="col-md-12 mb-3">

                    <label>
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      value={
                        editData.Description
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          Description:
                            e.target.value,
                        })
                      }
                    ></textarea>

                  </div>

                </div>

              )}

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >

                Close

              </button>

              <button
                className="btn btn-success"
                onClick={
                  handleUpdate
                }
                data-bs-dismiss="modal"
              >

                Update

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddAmounts;