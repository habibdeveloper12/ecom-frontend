import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInValidationSchema } from "../utils/SigninFormValidationSchema";
import axiosInstance from "../config/axiosConfig";
import { AuthContext } from "../components/AuthContext";
import Loading from "../components/Loading/Loading";
import { toast } from "react-toastify";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInValidationSchema),
    mode: "onBlur",
  });
  const navigate = useNavigate();

  const location = useLocation();
  const { user, authenticated, setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", data);

      const { accessToken, refreshToken } = response.data.data;

      console.log(accessToken, refreshToken);

      localStorage.setItem("accessToken", accessToken);
      setIsAuthenticated(true);

      let from = location.state?.from?.pathname || "/";
      navigate(from);

      setLoading(false);
      toast.success("Login successful!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } catch (error) {
      setLoading(false);

      toast.error("Login failed. Please check your credentials.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });

      console.error("Login failed:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  id="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="my-3">
                <p>
                  New Here?{" "}
                  <Link
                    to="/register"
                    className="text-decoration-underline text-info"
                  >
                    Register
                  </Link>{" "}
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
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

export default Login;
