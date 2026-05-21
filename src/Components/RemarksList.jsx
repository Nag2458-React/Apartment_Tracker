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
    selectedDate,
    setSelectedDate,
  ] = useState("");

  const currentDate =
    new Date();

  const currentMonth =
    currentDate.getMonth() + 1;

  const currentYear =
    currentDate.getFullYear();

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

            if (
              item.billDate
            ) {

              const billDate =
                new Date(
                  item.billDate
                );

              const billMonth =
                billDate.getMonth() + 1;

              const billYear =
                billDate.getFullYear();

              // CURRENT MONTH ONLY

              if (
                billMonth ===
                  currentMonth &&
                billYear ===
                  currentYear
              ) {

                remarksTemp.push(
                  item
                );

              }

            }

          }
        );

        setRemarksData(
          remarksTemp
        );

        setFilteredData(
          remarksTemp
        );

      } catch (error) {

        console.log(error);

      }

    };

  // DATE FILTER

  const handleDateChange = (
    e
  ) => {

    const value =
      e.target.value;

    setSelectedDate(
      value
    );

    if (!value) {

      setFilteredData(
        remarksData
      );

      return;

    }

    const filtered =
      remarksData.filter(
        (item) =>
          item.billDate ===
          value
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

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">

          <h3 className="text-white">

            Current Month Suggestions / Remarks List

          </h3>

          <div>

            <input
              type="date"
              className="form-control"
              value={
                selectedDate
              }
              onChange={
                handleDateChange
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

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan={5}
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