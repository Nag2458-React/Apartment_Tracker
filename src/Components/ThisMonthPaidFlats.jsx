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

import * as XLSX from "xlsx";

import {
  FaFileExcel,
} from "react-icons/fa";

const ThisMonthPaidFlats = () => {

  const navigate =
    useNavigate();

  const [data, setData] =
    useState([]);

  const [
    filteredData,
    setFilteredData,
  ] = useState([]);

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState("");

  // FETCH DATA

  const fetchData =
    async () => {

      try {

        const querySnapshot =
          await getDocs(
            collection(
              db,
              "flat_amounts"
            )
          );

        let tempData = [];

        querySnapshot.forEach(
          (doc) => {

            tempData.push({
              id: doc.id,
              ...doc.data(),
            });

          }
        );

        // SORT FLAT NUMBERS

        tempData.sort(
          (a, b) =>
            Number(
              a.flatNumber
            ) -
            Number(
              b.flatNumber
            )
        );

        setData(tempData);

        filterCurrentMonth(
          tempData
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchData();

  }, []);

  // CURRENT MONTH FILTER

  const filterCurrentMonth =
    (allData) => {

      const currentDate =
        new Date();

      const currentMonth =
        currentDate.getMonth() + 1;

      const currentYear =
        currentDate.getFullYear();

      const result =
        allData.filter(
          (item) => {

            if (
              !item.billDate
            )
              return false;

            const billDate =
              new Date(
                item.billDate
              );

            const billMonth =
              billDate.getMonth() + 1;

            const billYear =
              billDate.getFullYear();

            return (
              billMonth ===
                currentMonth &&
              billYear ===
                currentYear
            );

          }
        );

      setFilteredData(
        result
      );

    };

  // MONTH FILTER

  const handleMonthChange =
    (e) => {

      const value =
        e.target.value;

      setSelectedMonth(
        value
      );

      // DEFAULT CURRENT MONTH

      if (!value) {

        filterCurrentMonth(
          data
        );

        return;

      }

      const [
        year,
        month,
      ] = value.split("-");

      const result =
        data.filter(
          (item) => {

            if (
              !item.billDate
            )
              return false;

            const billDate =
              new Date(
                item.billDate
              );

            const billMonth =
              String(
                billDate.getMonth() + 1
              ).padStart(
                2,
                "0"
              );

            const billYear =
              billDate
                .getFullYear()
                .toString();

            return (
              billMonth ===
                month &&
              billYear ===
                year
            );

          }
        );

      setFilteredData(
        result
      );

    };

  // EXCEL DOWNLOAD

  const downloadExcel =
    () => {

      if (
        filteredData.length === 0
      ) {

        alert(
          "No Data Found"
        );

        return;
      }

      const excelData =
        filteredData.map(
          (
            item,
            index
          ) => ({

            "S.No":
              index + 1,

            "Flat Number":
              item.flatNumber,

            "Owner Name":
              item.ownerName,

            "Bill Date":
              item.billDate,

            "Maintenance Amount":
              item.maintenanceAmount,

            Status:
              Number(
                item.maintenanceAmount
              ) > 0
                ? "Paid"
                : "Pending",

          })
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          excelData
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Paid Flats"
      );

      const fileName =
        selectedMonth
          ? `PaidFlats-${selectedMonth}.xlsx`
          : "CurrentMonthPaidFlats.xlsx";

      XLSX.writeFile(
        workbook,
        fileName
      );

    };

  // TOTALS

  const totalPaidAmount =
    filteredData.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.maintenanceAmount || 0
        ),
      0
    );

  const totalPendingFlats =
    filteredData.filter(
      (item) =>
        Number(
          item.maintenanceAmount
        ) === 0
    ).length;

  const totalPaidFlats =
    filteredData.filter(
      (item) =>
        Number(
          item.maintenanceAmount
        ) > 0
    ).length;

  return (

    <div className="container mt-4 mb-5">

      <div className="card shadow-lg border-0 rounded-4 p-4">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

          <div>

            <h3 className="fw-bold">

              Paid Flats Details

            </h3>

            <p className="text-muted mb-0">

              Total Flats :
              {" "}

              <span className="fw-bold text-success">

                {
                  filteredData.length
                }

              </span>

            </p>

          </div>

          <button
            className="btn btn-dark"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >

            ← Back

          </button>

        </div>

        {/* MONTH PICKER + EXCEL ICON */}

        <div className="row mb-4 align-items-end">

          <div className="col-md-4 mb-3">

            <label className="fw-bold mb-2 text-black">

              Select Month

            </label>

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

          <div className="col-md-8 text-md-end mb-3">

            <button
              className="btn btn-success"
              onClick={
                downloadExcel
              }
              title="Download Excel"
            >

              <FaFileExcel
                size={22}
              />

            </button>

          </div>

        </div>

        {/* TABLE */}

        <div className="table-responsive paid">

          <table className="table table-bordered table-hover align-middle table-striped">

            <thead className="table-dark1">

              <tr>

                <th>
                  S.No
                </th>

                <th>
                  Flat No
                </th>

                <th>
                  Owner Name
                </th>

                <th>
                  Bill Date
                </th>

                <th>
                  Maintenance Amount
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
                    ) => {

                      const amount =
                        Number(
                          item.maintenanceAmount
                        ) || 0;

                      return (

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
                              item.billDate
                            }

                          </td>

                          <td
                            className={
                              amount > 0
                                ? "text-success fw-bold"
                                : "text-danger fw-bold"
                            }
                          >

                            ₹
                            {
                              amount
                            }

                          </td>

                          <td>

                            {
                              amount > 0 ? (

                                <span className="badge bg-success">

                                  Paid

                                </span>

                              ) : (

                                <span className="badge bg-danger">

                                  Pending

                                </span>

                              )
                            }

                          </td>

                        </tr>

                      );

                    }
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

            {/* TABLE FOOTER */}

            <tfoot className="table-dark1">

              <tr>

                <th
                  colSpan="2"
                  className="text-center"
                >

                  Total Flats :
                  {" "}
                  {
                    filteredData.length
                  }

                </th>

                <th
                  className="text-center text-success"
                >

                  Paid :
                  {" "}
                  {
                    totalPaidFlats
                  }

                </th>

                <th
                  className="text-center text-danger"
                >

                  Pending :
                  {" "}
                  {
                    totalPendingFlats
                  }

                </th>

                <th
                  colSpan="2"
                  className="text-center text-warning"
                >

                  Total Amount :
                  {" "}
                  ₹
                  {
                    totalPaidAmount
                  }

                </th>

              </tr>

            </tfoot>

          </table>

        </div>

      </div>

    </div>

  );

};

export default ThisMonthPaidFlats;