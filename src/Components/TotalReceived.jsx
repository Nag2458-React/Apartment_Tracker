import React, {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../Firebase";

import {
  useNavigate,
} from "react-router-dom";

const TotalReceived = () => {

  const navigate = useNavigate();

  const [data, setData] =
    useState([]);

  const [filteredData, setFilteredData] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [totalAmount, setTotalAmount] =
    useState(0);

  // FETCH DATA

  const fetchData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "flat_amounts")
        );

      let tempData = [];

      querySnapshot.forEach((doc) => {

        tempData.push({
          id: doc.id,
          ...doc.data(),
        });

      });

      // SORT BY DATE DESC

      tempData.sort((a, b) => {
        return (
          new Date(b.billDate) -
          new Date(a.billDate)
        );
      });

      setData(tempData);

      setFilteredData(tempData);

      calculateTotal(tempData);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  // TOTAL CALCULATION

  const calculateTotal = (
    records
  ) => {

    const total =
      records.reduce(
        (sum, item) =>
          sum +
          Number(
            item.maintenanceAmount || 0
          ),
        0
      );

    setTotalAmount(total);

  };

  // MONTH FILTER

  const handleMonthChange = (e) => {

    const value =
      e.target.value;

    setSelectedMonth(value);

    let filtered = [...data];

    // FILTER MONTH

    if (value) {

      const [
        year,
        month,
      ] = value.split("-");

      filtered = filtered.filter(
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
            billDate
              .getFullYear()
              .toString();

          return (
            billMonth === month &&
            billYear === year
          );
        }
      );
    }

    // SEARCH FILTER

    if (search) {

      filtered = filtered.filter(
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
    }

    setFilteredData(filtered);

    calculateTotal(filtered);

  };

  // SEARCH FILTER

  const handleSearch = (e) => {

    const value =
      e.target.value;

    setSearch(value);

    let filtered = [...data];

    // MONTH FILTER

    if (selectedMonth) {

      const [
        year,
        month,
      ] =
        selectedMonth.split("-");

      filtered = filtered.filter(
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
            billDate
              .getFullYear()
              .toString();

          return (
            billMonth === month &&
            billYear === year
          );
        }
      );
    }

    // SEARCH FILTER

    filtered = filtered.filter(
      (item) =>
        item.ownerName
          ?.toLowerCase()
          .includes(
            value.toLowerCase()
          ) ||
        item.flatNumber
          ?.toLowerCase()
          .includes(
            value.toLowerCase()
          )
    );

    setFilteredData(filtered);

    calculateTotal(filtered);

  };

  return (

    <div className="container mt-4">

      <div className="card shadow-lg border-0 rounded-4 p-4">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h3 className="fw-bold">
              Total Received Amount
            </h3>

            <h4 className="text-success fw-bold">
              ₹ {totalAmount}
            </h4>

          </div>

          <button
            className="btn btn-dark"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back
          </button>

        </div>

        {/* FILTERS */}

        <div className="row mb-4">

          {/* MONTH */}

          <div className="col-md-4 mb-3">

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

          {/* SEARCH */}

          <div className="col-md-4 mb-3">

            <label className="fw-bold mb-2">
              Search
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Search Flat / Owner"
              value={search}
              onChange={handleSearch}
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="table-responsive">

          <table className="table table-bordered table-hover align-middle table-striped">

            <thead className="table-dark1">

              <tr>

                <th>S.No</th>

                <th>Flat No</th>

                <th>Owner Name</th>

                <th>Bill Date</th>

                <th>Amount</th>

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

                        <td className="fw-bold text-success">
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

export default TotalReceived;