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
  useNavigate,
} from "react-router-dom";

const TotalReceived = () => {

  const navigate = useNavigate();

  const [data, setData] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const fetchData = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "flat_amounts")
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

  const filteredData =
    data.filter(
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

      <div className="card shadow-lg border-0 rounded-4 p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h3 className="fw-bold">
            Total Received Amount Details
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

        <div className="row mb-3">

          <div className="col-md-4">

            <input
              type="text"
              className="form-control"
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

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>S.No</th>
                <th>Flat No</th>
                <th>Owner Name</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>

            </thead>

            <tbody>

              {
                filteredData.length > 0 ? (

                  filteredData.map(
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
                            item.flatNumber
                          }
                        </td>

                        <td>
                          {
                            item.ownerName
                          }
                        </td>

                        <td>
                          {
                            item.billDate
                          }
                        </td>

                        <td className="fw-bold text-success">
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
                      colSpan="5"
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

export default TotalReceived;