import React from "react";
import { Footer, Navbar } from "../components";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../config/axiosConfig";
import { signupValidationSchema } from "../utils/SignupFormValidationSchema";
import { toast } from "react-toastify";

const Register = () => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupValidationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axiosInstance.post("/users/create-user", data);
      console.log(response);

      const { accessToken, refreshToken } = response.data.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Show success toast
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });

      // Handle any other logic, e.g., redirect to a dashboard page
    } catch (error) {
      // Show error toast
      toast.error("Registration failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });

      // Handle registration failure
      console.error("Registration failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Register</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form my-3">
                <label htmlFor="Name">Full Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="Name"
                  placeholder="Enter Your Name"
                  {...register("name")}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>
              <div className="form my-3">
                <label htmlFor="Email">Email address</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="Email"
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>
              <div className="form my-3">
                <label htmlFor="Password">Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  id="Password"
                  placeholder="Password"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="form my-3">
                <label htmlFor="ConfirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  id="ConfirmPassword"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
              <div className="my-3">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-underline text-info"
                  >
                    Login
                  </Link>{" "}
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
