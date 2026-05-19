import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  FaArrowRight,
} from "react-icons/fa";

const Dashboard = () => {
const navigate = useNavigate();
  const [data, setData] = useState([]);

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

  const fetchData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "flat_amounts")
        );

      let maintenanceTotal = 0;

      let expensesTotal = 0;

      let currentMonthMaintenance = 0;

      let currentMonthExpenses = 0;

      let currentMonthFlatCount = 0;
        let Description = "";
      const currentDate = new Date();

      const currentMonth =
        currentDate.getMonth() + 1;

      const currentYear =
        currentDate.getFullYear();

      const tempData = [];

      querySnapshot.forEach((doc) => {

        const item = {
          id: doc.id,
          ...doc.data(),
        };

        tempData.push(item);

        const maintenance =
          Number(
            item.maintenanceAmount
          ) || 0;

        const expenses =
          Number(
            item.expensesAmount
          ) || 0;

        maintenanceTotal += maintenance;

        expensesTotal += expenses;

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
              maintenance;

            currentMonthExpenses +=
              expenses;

            currentMonthFlatCount++;
          }
        }
      });

      setData(tempData);

      setTotalMaintenance(
        maintenanceTotal
      );

      setTotalExpenses(
        expensesTotal
      );

      setRemainingBalance(
        maintenanceTotal - expensesTotal
      );

      setMonthMaintenance(
        currentMonthMaintenance
      );

      setMonthExpenses(
        currentMonthExpenses
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

  const filteredData = data.filter(
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
    <div className="container mt-4">

      <div className="row g-4">
<div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-dark text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  This Month Paid Flats
                </h6>

                <h2 className="fw-bold">
                10 out of  {thisMonthPaidFlats}
                </h2>

              </div>

              <FaArrowRight size={35} />

            </div>

          </div>

        </div>
        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-success text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  Total Recieved Amount
                </h6>

                <h2 className="fw-bold">
                  ₹{totalMaintenance}
                </h2>

              </div>

              <FaArrowRight size={35} />

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-danger text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  Total Expenses
                </h6>

                <h2 className="fw-bold">
                  ₹{totalExpenses}
                </h2>

              </div>

              <FaArrowRight size={35} />

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-primary text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  Remaining Balance
                </h6>

                <h2 className="fw-bold">
                  ₹{remainingBalance}
                </h2>

              </div>

              <FaArrowRight size={35} />

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-warning text-dark">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  This Month Maintenance
                </h6>

                <h2 className="fw-bold">
                  ₹{monthMaintenance}
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

        <div className="col-md-4">

          <div className="card border-0 shadow-lg rounded-4 p-4 bg-info text-white">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h6 className="fw-light">
                  This Month Expenses
                </h6>

                <h2 className="fw-bold">
                  ₹{monthExpenses}
                </h2>

              </div>

              <FaArrowRight size={35} />

            </div>

          </div>

        </div>

        

      </div>

      <div className="card shadow-lg border-0 rounded-4 p-4 mt-5">

        <div className="row mb-4">

          <div className="col-md-4">

            <input
              type="text"
              className="form-control rounded-3"
              placeholder="Search Flat / Owner"
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-hover table-bordered align-middle">

            <thead className="table-dark">

              <tr>
                <th>S.No</th>
                <th>Flat No</th>
                <th>Owner Name</th>
                <th>Bill Date</th>
                <th>Maintenance</th>
                <th>Expenses</th>
                <th>Description</th>
              </tr>

            </thead>

            <tbody>

              {
                filteredData.length > 0 ? (

                  filteredData.map(
                    (item, index) => (

                      <tr key={item.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {item.flatNumber}
                        </td>

                        <td>
                          {item.ownerName}
                        </td>

                        <td>
                          {item.billDate}
                        </td>

                        <td className="text-success fw-bold">
                          ₹
                          {
                            item.maintenanceAmount
                          }
                        </td>

                        <td className="text-danger fw-bold">
                          ₹
                          {
                            item.expensesAmount
                          }
                        </td>
                            <td className="text-danger fw-bold">
                          
                          {
                            item.Description
                          }
                        </td>

                      </tr>
                    )
                  )
                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center text-danger fw-bold"
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

    </div>
  );
};

export default Dashboard;