import React, { useState } from "react";

import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
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
const App = () => {

  const [userRole, setUserRole] = useState(
    localStorage.getItem("role") || ""
  );

  return (
    <BrowserRouter>

      {
        userRole && (
          <Navbar
            userRole={userRole}
            setUserRole={setUserRole}
          />
        )
      }

      {/* ONLY ONE TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

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
  path="/this-month-paid-flats"
  element={<ThisMonthPaidFlats />}
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
          path="/this-month-maintenance"
          element={
            <ThisMonthMaintenance />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;