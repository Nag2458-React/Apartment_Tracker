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

  // STATES

  const [
    currentMonthReceived,
    setCurrentMonthReceived,
  ] = useState(0);

  const [
    currentMonthExpenses,
    setCurrentMonthExpenses,
  ] = useState(0);

  const [
    currentMonthBalance,
    setCurrentMonthBalance,
  ] = useState(0);

  const [
    previousMonthBalance,
    setPreviousMonthBalance,
  ] = useState(0);

  const [
    allMonthsBalance,
    setAllMonthsBalance,
  ] = useState(0);

  const [
    currentMonthPaidFlats,
    setCurrentMonthPaidFlats,
  ] = useState(0);

  const totalFlats = 10;

  const navigateMonth = (
    path
  ) => {

    navigate(path);

  };

  // MONTH NAME

  const currentDate =
    new Date();

  const monthName =
    currentDate.toLocaleString(
      "default",
      {
        month: "long",
      }
    );

  const currentYear =
    currentDate.getFullYear();

  // FETCH DATA

  const fetchData = async () => {

    try {

      // MAINTENANCE DATA

      const maintenanceSnapshot =
        await getDocs(
          collection(
            db,
            "flat_amounts"
          )
        );

      // EXPENSE DATA

      const expenseSnapshot =
        await getDocs(
          collection(
            db,
            "expenses"
          )
        );

      let currentReceived = 0;

      let currentExpense = 0;

      let allReceived = 0;

      let allExpenses = 0;

      let previousReceived = 0;

      let previousExpenses = 0;

      let paidFlats = 0;

      const currentMonth =
        currentDate.getMonth() + 1;

      const previousMonth =
        currentMonth === 1
          ? 12
          : currentMonth - 1;

      const previousYear =
        currentMonth === 1
          ? currentYear - 1
          : currentYear;

      // RECEIVED AMOUNTS

      maintenanceSnapshot.forEach(
        (doc) => {

          const item = {
            id: doc.id,
            ...doc.data(),
          };

          const amount =
            Number(
              item.maintenanceAmount
            ) || 0;

          allReceived += amount;

          if (item.billDate) {

            const billDate =
              new Date(
                item.billDate
              );

            const billMonth =
              billDate.getMonth() + 1;

            const billYear =
              billDate.getFullYear();

            // CURRENT MONTH

            if (
              billMonth ===
                currentMonth &&
              billYear ===
                currentYear
            ) {

              currentReceived +=
                amount;

              paidFlats++;

            }

            // PREVIOUS MONTH

            if (
              billMonth ===
                previousMonth &&
              billYear ===
                previousYear
            ) {

              previousReceived +=
                amount;

            }
          }
        }
      );

      // EXPENSES

      expenseSnapshot.forEach(
        (doc) => {

          const item = {
            id: doc.id,
            ...doc.data(),
          };

          const amount =
            Number(
              item.maintenanceAmount
            ) || 0;

          allExpenses += amount;

          if (item.billDate) {

            const billDate =
              new Date(
                item.billDate
              );

            const billMonth =
              billDate.getMonth() + 1;

            const billYear =
              billDate.getFullYear();

            // CURRENT MONTH

            if (
              billMonth ===
                currentMonth &&
              billYear ===
                currentYear
            ) {

              currentExpense +=
                amount;

            }

            // PREVIOUS MONTH

            if (
              billMonth ===
                previousMonth &&
              billYear ===
                previousYear
            ) {

              previousExpenses +=
                amount;

            }
          }
        }
      );

      // SET VALUES

      setCurrentMonthReceived(
        currentReceived
      );

      setCurrentMonthExpenses(
        currentExpense
      );

      setCurrentMonthBalance(
        currentReceived -
          currentExpense
      );

      setPreviousMonthBalance(
        previousReceived -
          previousExpenses
      );

      setAllMonthsBalance(
        allReceived - allExpenses
      );

      setCurrentMonthPaidFlats(
        paidFlats
      );

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  return (

    <div className="container mt-5 mb-5">

      <div className="row g-4">

        {/* CURRENT MONTH PAID FLATS */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-dark text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>
                  {monthName} - {currentYear} Paid Flats
                </h6>

                <h2 className="fw-bold">

                  {
                    currentMonthPaidFlats
                  }

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
                }}
                onClick={() =>
                  navigateMonth(
                    "/this-month-paid-flats"
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* CURRENT MONTH RECEIVED */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-success text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>

                  {monthName} - {currentYear} Received Amount

                </h6>

                <h2 className="fw-bold">

                  ₹
                  {
                    currentMonthReceived
                  }

                </h2>

              </div>

              <FaArrowRight
                size={35}
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigateMonth(
                    "/this-month-maintenance"
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* CURRENT MONTH EXPENSES */}

        <div className="col-md-4">

          <div
            className="card border-0 shadow-lg rounded-4 p-4 text-white"
            style={{
              background:
                "rgb(221 58 196)",
            }}
          >

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>

                  {monthName} - {currentYear} Expenses

                </h6>

                <h2 className="fw-bold">

                  ₹
                  {
                    currentMonthExpenses
                  }

                </h2>

              </div>

              <FaArrowRight
                size={35}
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigateMonth(
                    "/this-month-expenses"
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* CURRENT MONTH BALANCE */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-primary text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>

                  {monthName} - {currentYear} Remaining Balance

                </h6>

                <h2 className="fw-bold">

                  ₹
                  {
                    currentMonthBalance
                  }

                </h2>

              </div>

              <FaArrowRight
                size={35}
              />

            </div>

          </div>

        </div>

        {/* PREVIOUS MONTH BALANCE */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-warning text-dark">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>

                  Previous Month Remaining Balance

                </h6>

                <h2 className="fw-bold">

                  ₹
                  {
                    previousMonthBalance
                  }

                </h2>

              </div>

              <FaArrowRight
                size={35}
              />

            </div>

          </div>

        </div>

        {/* ALL MONTHS BALANCE */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-danger text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>

                  All Months Remaining Balance

                </h6>

                <h2 className="fw-bold">

                  ₹
                  {
                    allMonthsBalance
                  }

                </h2>

              </div>

              <FaArrowRight
                size={35}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;