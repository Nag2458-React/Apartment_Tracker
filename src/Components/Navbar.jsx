import React from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaMoneyBillWave,
  FaWallet,
  FaSignOutAlt,
} from "react-icons/fa";
const Navbar = ({ userRole, setUserRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    setUserRole("");

    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand nav-link" to="/dashboard">
          <img src={logo} alt="logo" style={{ width: "200px" }} />
        </Link>
        {/* <Link 
          className="navbar-brand nav-link"
          to="/dashboard"
        >
          Welcome to Naina Apartments
        </Link> */}

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <FaTachometerAlt /> Dashboard
            </Link>
          </li>

          {userRole === "admin" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/add-amounts">
                  <FaMoneyBillWave /> Add Amounts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add-expense">
                  <FaWallet /> Add Expense
                </Link>
              </li>
            </>
          )}

          <li className="nav-item">
            <button
              className="btn btn-danger btn-sm ms-3 log"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
