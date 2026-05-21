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

  const [
    remarksData,
    setRemarksData,
  ] = useState([]);

  const totalFlats = 10;

  const currentDate =
    new Date();

  const currentMonth =
    currentDate.getMonth() + 1;

  const currentYear =
    currentDate.getFullYear();

  const monthName =
    currentDate.toLocaleString(
      "default",
      {
        month: "long",
      }
    );

  // NAVIGATION

  const navigateMonth = (
    path
  ) => {

    navigate(path);

  };

  // FETCH DATA

  const fetchData = async () => {

    try {

      // MAINTENANCE

      const maintenanceSnapshot =
        await getDocs(
          collection(
            db,
            "flat_amounts"
          )
        );

      // EXPENSES

      const expenseSnapshot =
        await getDocs(
          collection(
            db,
            "expenses"
          )
        );

      // REMARKS

      const remarksSnapshot =
        await getDocs(
          collection(
            db,
            "remarks"
          )
        );

      let currentReceived = 0;

      let currentExpense = 0;

      let allReceived = 0;

      let allExpenses = 0;

      let previousReceived = 0;

      let previousExpenses = 0;

      let paidFlats = 0;

      let remarksTemp = [];

      const previousMonth =
        currentMonth === 1
          ? 12
          : currentMonth - 1;

      const previousYear =
        currentMonth === 1
          ? currentYear - 1
          : currentYear;

      // RECEIVED DATA

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

              if (amount > 0) {

                paidFlats++;

              }

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

      // REMARKS

      remarksSnapshot.forEach(
        (doc) => {

          const item = {
            id: doc.id,
            ...doc.data(),
          };

          if (item.billDate) {

            const billDate =
              new Date(
                item.billDate
              );

            const billMonth =
              billDate.getMonth() + 1;

            const billYear =
              billDate.getFullYear();

            // ONLY CURRENT MONTH REMARKS

            if (
              billMonth ===
                currentMonth &&
              billYear ===
                currentYear
            ) {

              remarksTemp.push(item);

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
        allReceived -
          allExpenses
      );

      setCurrentMonthPaidFlats(
        paidFlats
      );

      setRemarksData(
        remarksTemp
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

        {/* PAID FLATS */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-white text-black">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>

                  {monthName}
                  {" "}
                  -
                  {" "}
                  {currentYear}
                  {" "}
                  Paid Flats

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

        {/* RECEIVED */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-success text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>

                  {monthName}
                  {" "}
                  -
                  {" "}
                  {currentYear}
                  {" "}
                  Received Amount

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

        {/* EXPENSES */}

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

                  {monthName}
                  {" "}
                  -
                  {" "}
                  {currentYear}
                  {" "}
                  Expenses

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

        {/* CURRENT BALANCE */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-primary text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6>

                  {monthName}
                  {" "}
                  -
                  {" "}
                  {currentYear}
                  {" "}
                  Remaining Balance

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

        {/* PREVIOUS BALANCE */}

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

        {/* REMARKS COUNT BOX */}

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-dark text-white">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h5 className="mb-0">

                {monthName}
                {" "}
                -
                {" "}
                {currentYear}
                {" "}
                Suggestions

              </h5>

              <FaArrowRight
                size={30}
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(
                    "/remarks-list"
                  )
                }
              />

            </div>

            {
              remarksData.length > 0 ? (

                <div className="text-center">

                  <h1 className="fw-bold text-warning">

                    {
                      remarksData.length
                    }

                  </h1>

                  <h6 className="text-white">

                    Remarks This Month

                  </h6>

                </div>

              ) : (

                <h6 className="text-center text-danger">

                  No Remarks Found

                </h6>

              )
            }

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;