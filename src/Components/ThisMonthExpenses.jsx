import React, {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

const ThisMonthExpenses = () => {

  const [expenseData, setExpenseData] =
    useState([]);

  const [receivedData, setReceivedData] =
    useState([]);

  const [filteredExpenses, setFilteredExpenses] =
    useState([]);

  const [selectedMonth, setSelectedMonth] =
    useState("");

  // TOTALS

  const [totalExpenses, setTotalExpenses] =
    useState(0);

  const [totalReceived, setTotalReceived] =
    useState(0);

  const [remainingBalance, setRemainingBalance] =
    useState(0);

  // FETCH DATA

  const fetchData = async () => {

    try {

      // EXPENSES COLLECTION

      const expenseSnapshot =
        await getDocs(
          collection(db, "expenses")
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

      expenseSnapshot.forEach((doc) => {

        expenseTemp.push({
          id: doc.id,
          ...doc.data(),
        });

      });

      // RECEIVED DATA

      receivedSnapshot.forEach((doc) => {

        receivedTemp.push({
          id: doc.id,
          ...doc.data(),
        });

      });

      setExpenseData(expenseTemp);

      setReceivedData(receivedTemp);

      // DEFAULT CURRENT MONTH DATA

      filterMonthData(
        expenseTemp,
        receivedTemp,
        ""
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

      const [year, month] =
        monthValue.split("-");

      selectedYear =
        Number(year);

      selectedMonthNumber =
        Number(month);

    } else {

      // CURRENT MONTH

      selectedYear =
        currentDate.getFullYear();

      selectedMonthNumber =
        currentDate.getMonth() + 1;

    }

    // CURRENT MONTH EXPENSES

    const currentMonthExpenses =
      expenses.filter((item) => {

        if (!item.billDate)
          return false;

        const billDate =
          new Date(item.billDate);

        return (
          billDate.getFullYear() ===
            selectedYear &&
          billDate.getMonth() + 1 ===
            selectedMonthNumber
        );

      });

    // CURRENT MONTH RECEIVED

    const currentMonthReceived =
      received.filter((item) => {

        if (!item.billDate)
          return false;

        const billDate =
          new Date(item.billDate);

        return (
          billDate.getFullYear() ===
            selectedYear &&
          billDate.getMonth() + 1 ===
            selectedMonthNumber
        );

      });

    // CURRENT MONTH TOTAL EXPENSES

    const currentExpenseTotal =
      currentMonthExpenses.reduce(
        (total, item) =>
          total +
          Number(
            item.maintenanceAmount || 0
          ),
        0
      );

    // CURRENT MONTH TOTAL RECEIVED

    const currentReceivedTotal =
      currentMonthReceived.reduce(
        (total, item) =>
          total +
          Number(
            item.maintenanceAmount || 0
          ),
        0
      );

    // CURRENT MONTH BALANCE

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

  const handleMonthChange = (e) => {

    const value =
      e.target.value;

    setSelectedMonth(value);

    filterMonthData(
      expenseData,
      receivedData,
      value
    );
  };

  return (
    <div className="container mt-5 mb-5 month">

      {/* TOP CARDS */}

      <div className="row g-4 mb-4">

        {/* CURRENT MONTH EXPENSES */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 bg-danger text-white">

            <div className="card-body text-center py-4">

              <h5 className="fw-light">
                Current Month Expenses
              </h5>

              <h2 className="fw-bold">
                ₹ {totalExpenses}
              </h2>

            </div>

          </div>

        </div>

        {/* CURRENT MONTH RECEIVED */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 bg-success text-white">

            <div className="card-body text-center py-4">

              <h5 className="fw-light">
                Current Month Received
              </h5>

              <h2 className="fw-bold">
                ₹ {totalReceived}
              </h2>

            </div>

          </div>

        </div>

        {/* CURRENT MONTH BALANCE */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 bg-primary text-white">

            <div className="card-body text-center py-4">

              <h5 className="fw-light">
                Current Month Balance
              </h5>

              <h2 className="fw-bold">
                ₹ {remainingBalance}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* MONTH FILTER */}

      <div className=" border-0 mb-4">

        <div className="">

          <div className="row">

            <div className="col-md-4">

              <label className="fw-bold mb-2 text-white">
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

        </div>

      </div>

      {/* EXPENSE TABLE */}

      <div className="card border-0 shadow-lg rounded-4">

        <div className="card-body">

          <h3 className="mb-4">

            Current Month Expense Details

          </h3>

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead className="table-dark">

                <tr>

                  <th>S.No</th>

                  <th>Date</th>

                  <th>Expense Title</th>

                

                  <th>Amount</th>

                </tr>

              </thead>

              <tbody>

                {
                  filteredExpenses.length > 0 ? (

                    filteredExpenses.map(
                      (
                        item,
                        index
                      ) => (

                        <tr
                          key={item.id}
                        >

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

                         

                          <td className="fw-bold text-danger">

                            ₹ {
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