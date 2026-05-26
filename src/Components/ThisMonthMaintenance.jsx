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

import { db } from "../Firebase";

import * as XLSX from "xlsx";

import {
  FaFileExcel,
} from "react-icons/fa";

const ThisMonthMaintenance = () => {

  const [data, setData] =
    useState([]);

  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState("");

  const navigate =
    useNavigate();

  // FETCH DATA

  const fetchData =
    async (
      monthValue = ""
    ) => {

      try {

        const querySnapshot =
          await getDocs(
            collection(
              db,
              "flat_amounts"
            )
          );

        let filterMonth;
        let filterYear;

        // SELECT MONTH

        if (monthValue) {

          const splitDate =
            monthValue.split(
              "-"
            );

          filterYear =
            Number(
              splitDate[0]
            );

          filterMonth =
            Number(
              splitDate[1]
            );

        } else {

          // CURRENT MONTH

          const currentDate =
            new Date();

          filterMonth =
            currentDate.getMonth() + 1;

          filterYear =
            currentDate.getFullYear();

        }

        let tempData = [];

        querySnapshot.forEach(
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

              // FILTER MONTH

              if (
                billMonth ===
                  filterMonth &&
                billYear ===
                  filterYear
              ) {

                tempData.push(
                  item
                );

              }

            }

          }
        );

        // SORT FLAT NUMBER

        tempData.sort(
          (a, b) =>
            Number(
              a.flatNumber
            ) -
            Number(
              b.flatNumber
            )
        );

        setData(
          tempData
        );

      } catch (error) {

        console.log(
          error
        );

      }

    };

  useEffect(() => {

    fetchData();

  }, []);

  // MONTH FILTER

  const handleMonthChange =
    (e) => {

      const value =
        e.target.value;

      setSelectedMonth(
        value
      );

      fetchData(
        value
      );

    };

  // DOWNLOAD EXCEL

  const downloadExcel =
    () => {

      if (
        data.length === 0
      ) {

        alert(
          "No Data Found"
        );

        return;

      }

      const excelData =
        data.map(
          (
            item,
            index
          ) => ({

            "S.No":
              index + 1,

            "Flat No":
              item.flatNumber,

            "Owner Name":
              item.ownerName,

            "Bill Date":
              item.billDate,

            Maintenance:
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
        "Maintenance Data"
      );

      const fileName =
        selectedMonth
          ? `Maintenance-${selectedMonth}.xlsx`
          : "CurrentMonthMaintenance.xlsx";

      XLSX.writeFile(
        workbook,
        fileName
      );

    };

  // TOTALS

  const totalMaintenance =
    data.reduce(
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

  const totalPaidFlats =
    data.filter(
      (item) =>
        Number(
          item.maintenanceAmount
        ) > 0
    ).length;

  const totalPendingFlats =
    data.filter(
      (item) =>
        Number(
          item.maintenanceAmount
        ) === 0
    ).length;

  return (

    <div className="container mt-4 mb-5">

      <div className="card shadow-lg border-0 p-4 rounded-4">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">

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

            <h3 className="fw-bold">

              Maintenance Details

            </h3>

          </div>

          <div className="text-end">

            <h5 className="text-primary mb-2">

              Total Flats :
              {" "}
              {
                data.length
              }

            </h5>

            <h5 className="text-success">

              Total Amount :
              {" "}
              ₹
              {
                totalMaintenance
              }

            </h5>

          </div>

        </div>

        {/* MONTH PICKER + EXCEL */}

        <div className="row mb-4 align-items-end">

          <div className="col-md-4">

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

          <div className="col-md-8 text-md-end mt-3 mt-md-0">

            <button
              className="btn btn-success"
              onClick={
                downloadExcel
              }
              title="Download Excel"
            >

              <FaFileExcel size={22} />

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
                  Maintenance
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {
                data.length >
                0 ? (

                  data.map(
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
                    data.length
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
                    totalMaintenance
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

export default ThisMonthMaintenance;