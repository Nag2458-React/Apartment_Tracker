import React, { useState } from "react";

import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import AddAmounts from "./Components/AddAmounts";
import AddExpense from "./Components/AddExpense";
import ThisMonthMaintenance from "./Components/ThisMonthMaintenance";
import ThisMonthPaidFlats from "./Components/ThisMonthPaidFlats";
import TotalReceived from "./Components/TotalReceived";
import TotalExpenses from "./Components/TotalExpenses";
import ThisMonthExpenses from "./Components/ThisMonthExpenses";
import { Footer } from "./Components/Footer";
import { Remarks } from "./Components/Remarks";
import {RemarksList} from "./Components/RemarksList"
const AppContent = () => {

  const location = useLocation();

  const [userRole, setUserRole] =
    useState(
      localStorage.getItem("role") || ""
    );

  // HIDE FOOTER & NAVBAR IN LOGIN PAGE

  const isLoginPage =
    location.pathname === "/";

  return (
    <>

      {/* NAVBAR */}

      {
        userRole &&
        !isLoginPage && (
          <Navbar
            userRole={userRole}
            setUserRole={setUserRole}
          />
        )
      }

      {/* TOAST */}

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

      {/* ROUTES */}

      <Routes>

        <Route
          path="/"
          element={
            <Login
              setUserRole={setUserRole}
            />
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/add-amounts"
          element={<AddAmounts />}
        />

        <Route
          path="/add-expense"
          element={<AddExpense />}
        />

        <Route
          path="/this-month-expenses"
          element={
            <ThisMonthExpenses />
          }
        />

        <Route
          path="/this-month-paid-flats"
          element={
            <ThisMonthPaidFlats />
          }
        />

        <Route
          path="/total-received"
          element={<TotalReceived />}
        />

        <Route
          path="/total-expenses"
          element={<TotalExpenses />}
        />
    <Route
          path="/remarks"
          element={<Remarks />}
        />
         <Route
          path="/remarks-list"
          element={<RemarksList />}
        />
        <Route
          path="/this-month-maintenance"
          element={
            <ThisMonthMaintenance />
          }
        />

      </Routes>

      {/* FOOTER */}

      {
        !isLoginPage && <Footer />
      }

    </>
  );
};

const App = () => {

  return (
    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
};

export default App;