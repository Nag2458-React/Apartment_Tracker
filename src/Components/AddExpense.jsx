import React, {
  useEffect,
  useState,
} from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../Firebase";

import { toast } from "react-toastify";

import {
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const AddExpense = () => {

  const [form, setForm] =
    useState({
      billDate: "",
      title: "",
      maintenanceAmount: "",
    });

  const [data, setData] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  const fetchData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "expenses")
        );

      const temp = [];

      querySnapshot.forEach((doc) => {

        temp.push({
          id: doc.id,
          ...doc.data(),
        });

      });

      setData(temp);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        if (editId) {

          await updateDoc(
            doc(
              db,
              "expenses",
              editId
            ),
            form
          );

          toast.success(
            "Expense Updated"
          );

          setEditId(null);

        } else {

          await addDoc(
            collection(
              db,
              "expenses"
            ),
            form
          );

          toast.success(
            "Expense Added"
          );

        }

        setForm({
          billDate: "",
          title: "",
          maintenanceAmount: "",
        });

        fetchData();

        const modal =
          window.bootstrap.Modal.getInstance(
            document.getElementById(
              "editModal"
            )
          );

        if (modal) {

          modal.hide();

        }

      } catch (error) {

        console.log(error);

      }

    };

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure want to delete?"
        );

      if (!confirmDelete) {

        return;

      }

      try {

        await deleteDoc(
          doc(
            db,
            "expenses",
            id
          )
        );

        toast.success(
          "Deleted Successfully"
        );

        fetchData();

      } catch (error) {

        console.log(error);

      }

    };

  const handleEdit = (
    item
  ) => {

    setForm({
      billDate:
        item.billDate,
      title:
        item.title,
      maintenanceAmount:
        item.maintenanceAmount,
    });

    setEditId(item.id);

    const modal =
      new window.bootstrap.Modal(
        document.getElementById(
          "editModal"
        )
      );

    modal.show();

  };

  return (

    <div className="container mt-5 mb-5">

      {/* ADD FORM */}

      <div className="card shadow p-4">

        <h3 className="text-center mb-4 text-black">

          Add Expense

        </h3>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="row">

            <div className="col-md-4 mb-3">

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

            <div className="col-md-4 mb-3">

              <label>
                Expense Title
              </label>

              <input
                className="form-control"
                type="text"
                name="title"
                placeholder="Expense Title"
                value={
                  form.title
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <label>
                Expense Amount
              </label>

              <input
                className="form-control"
                type="number"
                name="maintenanceAmount"
                placeholder="Expense Amount"
                value={
                  form.maintenanceAmount
                }
                onChange={
                  handleChange
                }
                required
              />

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

      {/* TABLE */}

      <div className="card shadow mt-5 p-4">

        <h4 className="mb-4">

          Expense List

        </h4>

        <div className="table-responsive exp">

          <table className="table table-bordered table-striped">

            <thead className="table-dark1">

              <tr>

                <th>S.No</th>

                <th>Date</th>

                <th>Title</th>

                <th>Amount</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {
                data.length > 0 ? (

                  data.map(
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
                            item.billDate
                          }
                        </td>

                        <td>
                          {
                            item.title
                          }
                        </td>

                        <td className="fw-bold text-danger">

                          ₹
                          {
                            item.maintenanceAmount
                          }

                        </td>

                        {/* ACTION ICONS */}

                        <td className="text-center">

                          <FaEdit
                            className=" me-3"
                            style={{
                              cursor:
                                "pointer",
                              fontSize:
                                "18px",
                                color:"#29528d"
                            }}
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                          />

                          <FaTrash
                            className="text-danger"
                            style={{
                              cursor:
                                "pointer",
                              fontSize:
                                "18px",
                            }}
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                          />

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center"
                    >

                      No Data Found

                    </td>

                  </tr>

                )
              }

            </tbody>

          </table>

        </div>

      </div>

      {/* EDIT MODAL */}

      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
      >

        <div className="modal-dialog">

          <div className="modal-content">

            <div className="modal-header">

              <h5 className="modal-title">

                Edit Expense

              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>

            <div className="modal-body">

              <form
                onSubmit={
                  handleSubmit
                }
              >

                <div className="mb-3">

                  <label>
                    Bill Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="billDate"
                    value={
                      form.billDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="mb-3">

                  <label>
                    Expense Title
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="mb-3">

                  <label>
                    Amount
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="maintenanceAmount"
                    value={
                      form.maintenanceAmount
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <button className="btn btn-success w-100">

                  Update

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default AddExpense;