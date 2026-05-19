import React, { useState } from "react";

import "./App.css";
import ThisMonthMaintenance from "./Components/ThisMonthMaintenance";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import AddAmounts from "./Components/AddAmounts";

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

      <ToastContainer />

      <Routes>

        <Route
          path="/"
          element={
            <Login setUserRole={setUserRole} />
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
  path="/this-month-maintenance"
  element={<ThisMonthMaintenance />}
/>
      </Routes>

    </BrowserRouter>
  );
};

export default App;