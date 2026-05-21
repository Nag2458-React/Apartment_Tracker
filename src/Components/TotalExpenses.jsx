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
  useNavigate,
} from "react-router-dom";

const TotalExpenses = () => {

  const navigate = useNavigate();

  const [data, setData] =
    useState([]);

  const fetchData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "expenses")
        );

      const tempData = [];

      querySnapshot.forEach((doc) => {

        tempData.push({
          id: doc.id,
          ...doc.data(),
        });
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

      <div className="card shadow-lg border-0 rounded-4 p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h3 className="fw-bold">
            Total Expenses Details
          </h3>

          <button
            className="btn btn-dark"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            Back
          </button>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-hover table-striped">

            <thead className="table-dark1">

              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
              </tr>

            </thead>

            <tbody>

              {
                data.length > 0 ? (

                  data.map(
                    (
                      item,
                      index
                    ) => (

                      <tr key={item.id}>

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
                          ₹
                          {
                            item.maintenanceAmount
                          }
                        </td>

                      </tr>
                    )
                  )
                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      className="text-center text-danger"
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

export default TotalExpenses;