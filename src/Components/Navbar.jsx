import React from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

const Navbar = ({
  userRole,
  setUserRole,
}) => {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.clear();

    setUserRole("");

    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg">

      <div className="container">

        <Link
          className="navbar-brand"
          to="/dashboard"
        >
          Apartment Tracker
        </Link>

        <ul className="navbar-nav ms-auto">

          <li className="nav-item">

            <Link
              className="nav-link"
              to="/dashboard"
            >
              Dashboard
            </Link>

          </li>

          {
            userRole === "admin" && (
<>
              <li className="nav-item">

                <Link
                  className="nav-link"
                  to="/add-amounts"
                >
                  Add Amounts
                </Link>

              </li>
               <li className="nav-item">

                <Link
                  className="nav-link"
                  to="/add-expense"
                >
                  Add Expense
                </Link>

              </li>
              </>
            )
          }

          <li className="nav-item">

            <button
              className="btn btn-danger btn-sm ms-3"
              onClick={handleLogout}
            >
              Logout
            </button>

          </li>

        </ul>

      </div>

    </nav>
  );
};

export default Navbar;