import React, {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  useNavigate,
} from "react-router-dom";

import { db } from "../firebase";

const ThisMonthMaintenance = () => {

  const [data, setData] =
    useState([]);

  const navigate =
    useNavigate();

  const fetchData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "flat_amounts")
        );

      const currentDate =
        new Date();

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

            tempData.push(item);
          }
        }
      });

      setData(tempData);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  return (
    <div className="container mt-4">

      <div className="card shadow border-0 p-4 rounded-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <button
              className="btn btn-dark mb-3"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              ← Back
            </button>

            <h3>
              This Month Maintenance Details
            </h3>

          </div>

          <h5 className="text-primary">

            Total Paid Flats :
            {" "}
            {data.length}

          </h5>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

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
                data.length > 0 ? (

                  data.map(
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

                        <td>
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
                      colSpan="7"
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

export default ThisMonthMaintenance;