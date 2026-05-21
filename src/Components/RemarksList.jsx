import React, {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../Firebase";

export const RemarksList = () => {

  const [
    remarksData,
    setRemarksData,
  ] = useState([]);

  const [
    filteredData,
    setFilteredData,
  ] = useState([]);

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState("");

  // CURRENT MONTH

  const currentDate =
    new Date();

  const currentMonth =
    currentDate
      .getMonth() + 1;

  const currentYear =
    currentDate
      .getFullYear();

  // FETCH REMARKS

  const fetchRemarks =
    async () => {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              "remarks"
            )
          );

        let remarksTemp = [];

        snapshot.forEach(
          (doc) => {

            const item = {
              id: doc.id,
              ...doc.data(),
            };

            remarksTemp.push(
              item
            );

          }
        );

        // SORT LATEST FIRST

        remarksTemp.sort(
          (a, b) =>
            new Date(
              b.billDate
            ) -
            new Date(
              a.billDate
            )
        );

        setRemarksData(
          remarksTemp
        );

        // DEFAULT CURRENT MONTH DATA

        const currentMonthData =
          remarksTemp.filter(
            (item) => {

              const billDate =
                new Date(
                  item.billDate
                );

              return (
                billDate.getMonth() + 1 ===
                  currentMonth &&
                billDate.getFullYear() ===
                  currentYear
              );

            }
          );

        setFilteredData(
          currentMonthData
        );

      } catch (error) {

        console.log(error);

      }

    };

  // MONTH FILTER

  const handleMonthChange = (
    e
  ) => {

    const value =
      e.target.value;

    setSelectedMonth(
      value
    );

    // SHOW CURRENT MONTH IF EMPTY

    if (!value) {

      const currentMonthData =
        remarksData.filter(
          (item) => {

            const billDate =
              new Date(
                item.billDate
              );

            return (
              billDate.getMonth() + 1 ===
                currentMonth &&
              billDate.getFullYear() ===
                currentYear
            );

          }
        );

      setFilteredData(
        currentMonthData
      );

      return;

    }

    // SELECTED MONTH FILTER

    const [
      year,
      month,
    ] = value.split("-");

    const filtered =
      remarksData.filter(
        (item) => {

          const billDate =
            new Date(
              item.billDate
            );

          return (
            billDate.getMonth() + 1 ===
              Number(month) &&
            billDate.getFullYear() ===
              Number(year)
          );

        }
      );

    setFilteredData(
      filtered
    );

  };

  useEffect(() => {

    fetchRemarks();

  }, []);

  return (

    <div className="container mt-5 mb-5">

      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{
          background:
            "rgba(0,0,0,0.7)",
        }}
      >

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

          <h3 className="text-white">

            Suggestions / Remarks Status

          </h3>

          <div>

            <input
              type="month"
              className="form-control"
              value={
                selectedMonth
              }
              onChange={
                handleMonthChange
              }
            />

          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-hover text-center align-middle">

            <thead className="table-dark">

              <tr>

                <th>
                  S.No
                </th>

                <th>
                  Flat Number
                </th>

                <th>
                  Owner Name
                </th>

                <th>
                  Suggestion / Remark
                </th>

                <th>
                  Date
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {
                filteredData.length >
                0 ? (

                  filteredData.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={
                          item.id
                        }
                      >

                        <td>

                          {
                            index + 1
                          }

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
                            item.description
                          }

                        </td>

                        <td>

                          {
                            item.billDate
                          }

                        </td>

                        <td>

                          <span
                            className={
                              item.status ===
                              "Clear"
                                ? "badge bg-success"
                                : "badge bg-warning text-dark"
                            }
                          >

                            {
                              item.status
                            }

                          </span>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-danger fw-bold"
                    >

                      No Remarks Found

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