import React, {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  useNavigate,
} from "react-router-dom";

const ThisMonthPaidFlats = () => {

  const navigate = useNavigate();

  const [data, setData] =
    useState([]);

  const [filteredData, setFilteredData] =
    useState([]);

  const [selectedMonth, setSelectedMonth] =
    useState("");

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

      filterCurrentMonth(tempData);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // Default Current Month Data

  const filterCurrentMonth = (
    allData
  ) => {

    const currentDate =
      new Date();

    const currentMonth =
      currentDate.getMonth() + 1;

    const currentYear =
      currentDate.getFullYear();

    const result = allData.filter(
      (item) => {

        if (!item.billDate)
          return false;

        const billDate =
          new Date(item.billDate);

        const billMonth =
          billDate.getMonth() + 1;

        const billYear =
          billDate.getFullYear();

        return (
          billMonth === currentMonth &&
          billYear === currentYear
        );
      }
    );

    setFilteredData(result);
  };

  // Month Picker Filter

  const handleMonthChange = (e) => {

    const value =
      e.target.value;

    setSelectedMonth(value);

    if (!value) {

      filterCurrentMonth(data);

      return;
    }

    const [
      year,
      month,
    ] = value.split("-");

    const result = data.filter(
      (item) => {

        if (!item.billDate)
          return false;

        const billDate =
          new Date(item.billDate);

        const billMonth =
          String(
            billDate.getMonth() + 1
          ).padStart(2, "0");

        const billYear =
          billDate.getFullYear().toString();

        return (
          billMonth === month &&
          billYear === year
        );
      }
    );

    setFilteredData(result);
  };

  return (
    <div className="container mt-4">

      <div className="card shadow-lg border-0 rounded-4 p-4">

        {/* Top Section */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h3 className="fw-bold">
              Paid Flats Details
            </h3>

            <p className="text-muted mb-0">
              Total Paid Flats :
              {" "}
              <span className="fw-bold text-success">
                {
                  filteredData.length
                }
              </span>
            </p>

          </div>

          <button
            className="btn btn-dark"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            ← Back
          </button>

        </div>

        {/* Month Picker */}

        <div className="row mb-4">

          <div className="col-md-4">

            <label className="fw-bold mb-2">
              Select Month
            </label>

            <input
              type="month"
              className="form-control"
              value={selectedMonth}
              onChange={
                handleMonthChange
              }
            />

          </div>

        </div>

        {/* Table */}

        <div className="table-responsive">

          <table className="table table-bordered table-hover align-middle table-striped">

            <thead className="table-dark1">

              <tr>
                <th>S.No</th>
                <th>Flat No</th>
                <th>Owner Name</th>
                <th>Bill Date</th>
                <th>Maintenance Amount</th>
              </tr>

            </thead>

            <tbody>

              {
                filteredData.length > 0 ? (

                  filteredData.map(
                    (
                      item,
                      index
                    ) => (

                      <tr key={item.id}>

                        <td>
                          {index + 1}
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

                        <td className="text-success fw-bold">
                          ₹
                          {
                            item.maintenanceAmount
                          }
                        </td>

                      </tr>
                    )
                  )
                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center text-danger fw-bold"
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

    </div>
  );
};

export default ThisMonthPaidFlats;