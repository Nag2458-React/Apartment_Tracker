import React, { useState } from "react";
import logo from "../assets/logo.png"
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { db } from "../Firebase";

const Login = ({ setUserRole }) => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const q = query(
        collection(db, "users"),
        where("email", "==", form.email),
        where("password", "==", form.password)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {

        toast.error("Invalid Email or Password");

        return;
      }

      querySnapshot.forEach((doc) => {

        const user = doc.data();

        localStorage.setItem(
          "role",
          user.role
        );

        setUserRole(user.role);

        toast.success("Login Success");

        setTimeout(() => {

          navigate("/dashboard");

        }, 1000);
      });

    } catch (error) {

      console.log(error);

      toast.error("Firebase Error");
    }
  };

  return (
    <div className="container">   
      <div className="text-center mt-5">
      <img src={logo} alt="logo"  style={{width:"250px"}}/>
      </div>
      <div className="row justify-content-center">

        <div className="col-md-4 mt-5">

          <div className="card shadow p-4">

            <h3 className="text-center mb-4">
              Login
            </h3>

            <form onSubmit={handleLogin}>

              <div className="mb-3">

                <label className="text-black">Email</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />

              </div>

              <div className="mb-3">

                <label  className="text-black">Password</label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />

              </div>

              <button className="btn btn-primary w-100">  
                Login
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;