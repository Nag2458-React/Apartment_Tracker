import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../Firebase";

const ThisMonthExpenses = () => {

  const [expenseData, setExpenseData] =
    useState([]);

  const [receivedData, setReceivedData] =
    useState([]);

  const [
    filteredExpenses,
    setFilteredExpenses,
  ] = useState([]);

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState("");

  // TOTALS

  const [
    totalExpenses,
    setTotalExpenses,
  ] = useState(0);

  const [
    totalReceived,
    setTotalReceived,
  ] = useState(0);

  const [
    remainingBalance,
    setRemainingBalance,
  ] = useState(0);

  // MOVE THIS HERE

  const navigate =
    useNavigate();

  // FETCH DATA

  const fetchData =
    async () => {

      try {

        // EXPENSES COLLECTION

        const expenseSnapshot =
          await getDocs(
            collection(
              db,
              "expenses"
            )
          );

        // RECEIVED COLLECTION

        const receivedSnapshot =
          await getDocs(
            collection(
              db,
              "flat_amounts"
            )
          );

        let expenseTemp = [];

        let receivedTemp = [];

        // EXPENSE DATA

        expenseSnapshot.forEach(
          (doc) => {

            expenseTemp.push({
              id: doc.id,
              ...doc.data(),
            });

          }
        );

        // SORT DATE LATEST FIRST

        expenseTemp.sort(
          (a, b) =>
            new Date(
              b.billDate
            ) -
            new Date(
              a.billDate
            )
        );

        // RECEIVED DATA

        receivedSnapshot.forEach(
          (doc) => {

            receivedTemp.push({
              id: doc.id,
              ...doc.data(),
            });

          }
        );

        setExpenseData(
          expenseTemp
        );

        setReceivedData(
          receivedTemp
        );

        // DEFAULT CURRENT MONTH

        filterMonthData(
          expenseTemp,
          receivedTemp,
          ""
        );

      } catch (error) {

        console.log(
          error
        );

      }

    };

  useEffect(() => {

    fetchData();

  }, []);

  // FILTER MONTH DATA

  const filterMonthData =
    (
      expenses,
      received,
      monthValue
    ) => {

      const currentDate =
        new Date();

      let selectedYear;

      let selectedMonthNumber;

      // SELECT MONTH

      if (monthValue) {

        const [
          year,
          month,
        ] =
          monthValue.split(
            "-"
          );

        selectedYear =
          Number(
            year
          );

        selectedMonthNumber =
          Number(
            month
          );

      } else {

        // CURRENT MONTH

        selectedYear =
          currentDate.getFullYear();

        selectedMonthNumber =
          currentDate.getMonth() + 1;

      }

      // CURRENT MONTH EXPENSES

      const currentMonthExpenses =
        expenses.filter(
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
              billDate.getFullYear() ===
                selectedYear &&
              billDate.getMonth() + 1 ===
                selectedMonthNumber
            );

          }
        );

      // CURRENT MONTH RECEIVED

      const currentMonthReceived =
        received.filter(
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
              billDate.getFullYear() ===
                selectedYear &&
              billDate.getMonth() + 1 ===
                selectedMonthNumber
            );

          }
        );

      // TOTAL EXPENSES

      const currentExpenseTotal =
        currentMonthExpenses.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.maintenanceAmount || 0
            ),
          0
        );

      // TOTAL RECEIVED

      const currentReceivedTotal =
        currentMonthReceived.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.maintenanceAmount || 0
            ),
          0
        );

      // BALANCE

      const currentBalance =
        currentReceivedTotal -
        currentExpenseTotal;

      // SET VALUES

      setFilteredExpenses(
        currentMonthExpenses
      );

      setTotalExpenses(
        currentExpenseTotal
      );

      setTotalReceived(
        currentReceivedTotal
      );

      setRemainingBalance(
        currentBalance
      );

    };

  // MONTH CHANGE

  const handleMonthChange =
    (e) => {

      const value =
        e.target.value;

      setSelectedMonth(
        value
      );

      filterMonthData(
        expenseData,
        receivedData,
        value
      );

    };

  return (

    <div className="container mt-5 mb-5 month">

      {/* EXPENSE TABLE */}

      <div className="card border-0 shadow-lg rounded-4">

        <div className="card-body">

          <div
            className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3"
          >

            <h3 className="mb-0">

              Current Month Expense Details

            </h3>

            <div
              className="d-flex align-items-end gap-3 flex-wrap"
            >

              <div>

                <label className="fw-bold mb-2 text-black">

                  Select Month

                </label>

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

          </div>

          {/* TOTALS */}

          {/* <div className="row g-4 mb-4">

            <div className="col-md-4">

              <div className="card bg-danger text-white border-0 shadow">

                <div className="card-body text-center">

                  <h6>

                    Total Expenses

                  </h6>

                  <h3>

                    ₹
                    {
                      totalExpenses
                    }

                  </h3>

                </div>

              </div>

            </div>

            <div className="col-md-4">

              <div className="card bg-success text-white border-0 shadow">

                <div className="card-body text-center">

                  <h6>

                    Total Received

                  </h6>

                  <h3>

                    ₹
                    {
                      totalReceived
                    }

                  </h3>

                </div>

              </div>

            </div>

            <div className="col-md-4">

              <div className="card bg-primary text-white border-0 shadow">

                <div className="card-body text-center">

                  <h6>

                    Remaining Balance

                  </h6>

                  <h3>

                    ₹
                    {
                      remainingBalance
                    }

                  </h3>

                </div>

              </div>

            </div>

          </div> */}

          {/* TABLE */}

          <div className="table-responsive exp">

            <table className="table table-bordered table-hover align-middle table-striped">

              <thead className="table-dark1">

                <tr>

                  <th>
                    S.No
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Expense Title
                  </th>

                  <th>
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  filteredExpenses.length >
                  0 ? (

                    filteredExpenses.map(
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

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        className="text-center text-danger fw-bold"
                      >

                        No Expense Data Found

                      </td>

                    </tr>

                  )
                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ThisMonthExpenses;