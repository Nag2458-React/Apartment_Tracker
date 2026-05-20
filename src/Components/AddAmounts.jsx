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

import { db } from "../firebase";

import { toast } from "react-toastify";

const AddAmounts = () => {

  const [form, setForm] = useState({
    flatNumber: "",
    ownerName: "",
    billDate: "",
    maintenanceAmount: "",
    // expensesAmount: "",
    // Description:""
  });

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [editData, setEditData] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 5;

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await addDoc(
        collection(db, "flat_amounts"),
        form
      );

      toast.success("Data Added Successfully");

      setForm({
        flatNumber: "",
        ownerName: "",
        billDate: "",
        maintenanceAmount: "",
        // expensesAmount: "",
        // Description:""
      });

      fetchData();

    } catch (error) {

      console.log(error);

      toast.error("Failed To Add Data");
    }
  };

  const fetchData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "flat_amounts")
        );

      const tempData = [];

      querySnapshot.forEach((doc) => {

        tempData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setData(tempData);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure want to delete?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(db, "flat_amounts", id)
      );

      toast.success("Deleted Successfully");

      fetchData();

    } catch (error) {

      console.log(error);

      toast.error("Delete Failed");
    }
  };

  const handleEdit = (item) => {

    setEditData(item);
  };

  const handleUpdate = async () => {

    try {

      const updateRef = doc(
        db,
        "flat_amounts",
        editData.id
      );

      await updateDoc(updateRef, {
        flatNumber: editData.flatNumber,
        ownerName: editData.ownerName,
        billDate: editData.billDate,
        maintenanceAmount:
          editData.maintenanceAmount,
        // expensesAmount:
        //   editData.expensesAmount,
        //    Description:
        //   editData.Description,
      });

      toast.success("Updated Successfully");

      setEditData(null);

      fetchData();

    } catch (error) {

      console.log(error);

      toast.error("Update Failed");
    }
  };

  const filteredData = data.filter((item) =>
    item.ownerName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const lastIndex =
    currentPage * recordsPerPage;

  const firstIndex =
    lastIndex - recordsPerPage;

  const currentRecords =
    filteredData.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    filteredData.length / recordsPerPage
  );

  return (
    <div className="container mt-5 mb-5">

      <div className="card p-4 shadow" style={{background:"transparent",border:"1px solid #ffffff8c"}}>

        <h3 className="text-center mb-4 text-white">
          Add Flat Amounts
        </h3>

        <form onSubmit={handleSubmit}>

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
                value={form.flatNumber}
                onChange={handleChange}
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
                value={form.ownerName}
                onChange={handleChange}
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
                value={form.billDate}
                onChange={handleChange}
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
                placeholder="Maintenance"
                value={form.maintenanceAmount}
                onChange={handleChange}
                required
              />

            </div>

            {/* <div className="col-md-3 mb-3">

              <label>
                Expenses Amount
              </label>

              <input
                className="form-control"
                type="number"
                name="expensesAmount"
                placeholder="Expenses"
                value={form.expensesAmount}
                onChange={handleChange}
                required
              />

            </div> */}
            {/* <div className="col-md-3 mb-3">

              <label>
                Description
              </label>

            <textarea
  className="form-control"
  cols={1}
  name="Description"
                placeholder="Description for Issues"
                value={form.Description}
                onChange={handleChange}
></textarea>
            </div> */}
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

      <div className="card shadow p-4 mt-5">

        <div className="row mb-3">

          <div className="col-md-4">

            <input
              type="text"
              className="form-control"
              placeholder="Search Owner Name"
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-dark1">

              <tr>
                <th>S.No</th>
                <th>Flat No</th>
                <th>Owner Name</th>
                <th>Bill Date</th>
                <th>Maintenance</th>
                
                
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {
                currentRecords.length > 0 ? (

                  currentRecords.map(
                    (item, index) => (

                      <tr key={item.id}>

                        <td>
                          {firstIndex + index + 1}
                        </td>

                        <td>
                          {item.flatNumber}
                        </td>

                        <td>
                          {item.ownerName}
                        </td>

                        <td>
                          {item.billDate}
                        </td>

                        <td>
                          ₹
                          {item.maintenanceAmount}
                        </td>

                       
                      
                        <td>

                          <button
                            className="btn btn-primary btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#editModal"
                            onClick={() =>
                              handleEdit(item)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDelete(item.id)
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    )
                  )
                ) : (

                  <tr>

                    <td
                      colSpan="7"
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

        <div className="d-flex justify-content-center mt-3">

          {
            [...Array(totalPages)].map(
              (_, index) => (

                <button
                  key={index}
                  className={`btn mx-1 ${
                    currentPage === index + 1
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                >
                  {index + 1}
                </button>
              )
            )
          }

        </div>

      </div>

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

              {
                editData && (

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

                 

                  </div>
                )
              }

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
                onClick={handleUpdate}
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