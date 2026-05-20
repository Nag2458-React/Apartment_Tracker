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

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const navigate =
    useNavigate();

  const fetchData = async (
    monthValue = ""
  ) => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "flat_amounts")
        );

      let filterMonth;
      let filterYear;

      if (monthValue) {

        const splitDate =
          monthValue.split("-");

        filterYear =
          Number(splitDate[0]);

        filterMonth =
          Number(splitDate[1]);

      } else {

        const currentDate =
          new Date();

        filterMonth =
          currentDate.getMonth() + 1;

        filterYear =
          currentDate.getFullYear();
      }

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
            billMonth === filterMonth &&
            billYear === filterYear
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

  const handleMonthChange = (e) => {

    const value =
      e.target.value;

    setSelectedMonth(value);

    fetchData(value);
  };

  const totalMaintenance =
    data.reduce(
      (total, item) =>
        total +
        Number(
          item.maintenanceAmount || 0
        ),
      0
    );

  return (
    <div className="container mt-4">

      <div className="card shadow border-0 p-4 rounded-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

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

              Total Paid Flats :
              {" "}
              {data.length}

            </h5>

            <h5 className="text-success">

              Total Amount :
              {" "}
              ₹{totalMaintenance}

            </h5>

          </div>

        </div>

        <div className="row mb-4">

          <div className="col-md-4">

            <label className="fw-bold mb-2">
              Select Month
            </label>

            <input
              type="month"
              className="form-control"
              value={selectedMonth}
              onChange={
                handleMonthChange
              }
            />

          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-hover align-middle">

            <thead className="table-dark1">

              <tr>
                <th>S.No</th>
                <th>Flat No</th>
                <th>Owner Name</th>
                <th>Bill Date</th>
                <th>Maintenance</th>
               
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

                        <td className="text-success fw-bold">

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