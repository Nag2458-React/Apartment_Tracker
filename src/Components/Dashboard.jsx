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
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  const [maintenanceData, setMaintenanceData] =
    useState([]);

  const [expenseData, setExpenseData] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    totalMaintenance,
    setTotalMaintenance,
  ] = useState(0);

  const [
    totalExpenses,
    setTotalExpenses,
  ] = useState(0);

  const [
    remainingBalance,
    setRemainingBalance,
  ] = useState(0);

  const [
    monthMaintenance,
    setMonthMaintenance,
  ] = useState(0);

  const [
    monthExpenses,
    setMonthExpenses,
  ] = useState(0);

  const [
    thisMonthPaidFlats,
    setThisMonthPaidFlats,
  ] = useState(0);

  const totalFlats = 10;

  const fetchData = async () => {

    try {

      // Maintenance Collection
      const maintenanceSnapshot =
        await getDocs(
          collection(db, "flat_amounts")
        );

      // Expense Collection
      const expenseSnapshot =
        await getDocs(
          collection(db, "expenses")
        );

      const maintenanceTemp = [];

      const expenseTemp = [];

      let maintenanceTotal = 0;

      let expenseTotal = 0;

      let currentMonthMaintenance = 0;

      let currentMonthExpense = 0;

      let currentMonthFlatCount = 0;

      const currentDate = new Date();

      const currentMonth =
        currentDate.getMonth() + 1;

      const currentYear =
        currentDate.getFullYear();

      // Maintenance Data
      maintenanceSnapshot.forEach((doc) => {

        const item = {
          id: doc.id,
          ...doc.data(),
        };

        maintenanceTemp.push(item);

        const amount =
          Number(
            item.maintenanceAmount
          ) || 0;

        maintenanceTotal += amount;

        if (item.billDate) {

          const billDate =
            new Date(item.billDate);

          const billMonth =
            billDate.getMonth() + 1;

          const billYear =
            billDate.getFullYear();

          if (
            billMonth === currentMonth &&
            billYear === currentYear
          ) {

            currentMonthMaintenance +=
              amount;

            currentMonthFlatCount++;
          }
        }
      });

      // Expense Data
      expenseSnapshot.forEach((doc) => {

        const item = {
          id: doc.id,
          ...doc.data(),
        };

        expenseTemp.push(item);

        const amount =
          Number(
            item.maintenanceAmount
          ) || 0;

        expenseTotal += amount;

        if (item.billDate) {

          const billDate =
            new Date(item.billDate);

          const billMonth =
            billDate.getMonth() + 1;

          const billYear =
            billDate.getFullYear();

          if (
            billMonth === currentMonth &&
            billYear === currentYear
          ) {

            currentMonthExpense +=
              amount;
          }
        }
      });

      setMaintenanceData(
        maintenanceTemp
      );

      setExpenseData(
        expenseTemp
      );

      setTotalMaintenance(
        maintenanceTotal
      );

      setTotalExpenses(
        expenseTotal
      );

      setRemainingBalance(
        maintenanceTotal - expenseTotal
      );

      setMonthMaintenance(
        currentMonthMaintenance
      );

      setMonthExpenses(
        currentMonthExpense
      );

      setThisMonthPaidFlats(
        currentMonthFlatCount
      );

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  const filteredData =
    maintenanceData.filter(
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

  return (
    <div className="container mt-4 mb-5">

      {/* Cards */}

      <div className="row g-4 dash">

        {/* Paid Flats */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4  bg-white text-black">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  This Month Paid Flats
                </h6>

                <h2 className="fw-bold">
                  {thisMonthPaidFlats}
                  {" "}
                  /
                  {" "}
                  {totalFlats}
                </h2>

              </div>

              <FaArrowRight
  size={35}
  style={{
    cursor: "pointer",
    background:"#c5dcff"
  }}
  onClick={() =>
    navigate(
      "/this-month-paid-flats"
    )
  }
/>

            </div>

          </div>

        </div>

        {/* Total Received */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4  bg-success text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  Total Received Amount
                </h6>

                <h2 className="fw-bold">
                  ₹
                  {
                    totalMaintenance
                  }
                </h2>

              </div>

             <FaArrowRight
  size={35}
  style={{
    cursor: "pointer",
  }}
  onClick={() =>
    navigate(
      "/total-received"
    )
  }
/>

            </div>

          </div>

        </div>

        {/* Total Expense */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4  bg-danger text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  Total Expenses
                </h6>

                <h2 className="fw-bold">
                  ₹
                  {
                    totalExpenses
                  }
                </h2>

              </div>

             <FaArrowRight
  size={35}
  style={{
    cursor: "pointer",
  }}
  onClick={() =>
    navigate(
      "/total-expenses"
    )
  }
/>

            </div>

          </div>

        </div>

        {/* Remaining */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4  bg-primary text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  Remaining Balance
                </h6>

                <h2 className="fw-bold">
                  ₹
                  {
                    remainingBalance
                  }
                </h2>

              </div>

              <FaArrowRight
                size={35}
              />

            </div>

          </div>

        </div>

        {/* Month Maintenance */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4  bg-warning text-dark">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  This Month Received Amount
                </h6>

                <h2 className="fw-bold">
                  ₹
                  {
                    monthMaintenance
                  }
                </h2>

              </div>

              <FaArrowRight
                size={35}
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(
                    "/this-month-maintenance"
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* Month Expense */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4  text-white" style={{background:"rgb(221 58 196)"}}>

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  This Month Expenses
                </h6>

                <h2 className="fw-bold">
                  ₹
                  {
                    monthExpenses
                  }
                </h2>

              </div>

              <FaArrowRight
  size={35}
  style={{
    cursor: "pointer",
  }}
  onClick={() =>
    navigate(
      "/this-month-expenses"
    )
  }
/>

            </div>

          </div>

        </div>

      </div>

      {/* Maintenance Table */}

      <div className="card shadow-lg border-0 rounded-4 p-4 mt-5">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4>
           Total Maintenance Details
          </h4>

          <input
            type="text"
            className="form-control w-25"
            placeholder="Search"
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="table-responsive">

          <table className="table table-hover table-bordered align-middle table-striped">

            <thead className="table-dark1">

              <tr>
                <th>S.No</th>
                <th>Flat No</th>
                <th>Owner Name</th>
                <th>Bill Date</th>
                <th>Maintenance</th>
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
                      className="text-center text-danger"
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

      {/* Expense Table */}

      <div className="card shadow-lg border-0 rounded-4 p-4 mt-5">

        <h4 className="mb-4">
         Total Expense Details
        </h4>

        <div className="table-responsive">

          <table className="table table-bordered table-hover table-striped">

            <thead className="table-dark1">

              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Expense Title</th>
                <th>Amount</th>
              </tr>

            </thead>

            <tbody>

              {
                expenseData.length > 0 ? (

                  expenseData.map(
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
                            item.billDate
                          }
                        </td>

                        <td>
                          {
                            item.title
                          }
                        </td>

                        <td className="text-danger fw-bold">
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
                      colSpan="4"
                      className="text-center text-danger"
                    >
                      No Expense Data
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

export default Dashboard;