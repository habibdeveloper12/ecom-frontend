import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../config/axiosConfig";

export const AuthContext = React.createContext();
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [authenticated, setIsAuthenticated] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = () => {
    localStorage.removeItem("accessToken");
    Cookies.remove("refreshToken");

    setIsAuthenticated(false);
  };
  let accessToken;
  useEffect(() => {
    const verifyAccessToken = async () => {
      try {
        accessToken = await localStorage.getItem("accessToken");

        if (!accessToken) {
          signOut();

          return;
        }

        try {
          const decoded = jwtDecode(accessToken);

          if (decoded.exp < Date.now() / 1000) {
            console.log("Token has expired");

            const refreshToken = Cookies.get("refreshToken");

            if (!refreshToken) {
              signOut();

              return;
            }

            try {
              const refreshResponse = await axiosInstance.post(
                "/refresh-token",
                {
                  refreshToken,
                }
              );

              const newAccessToken = refreshResponse.data.accessToken;

              localStorage.setItem("accessToken", newAccessToken);

              const newDecoded = jwtDecode(newAccessToken);

              setUser(newDecoded);
              setIsAuthenticated(true);
            } catch (refreshError) {
              console.error("Error refreshing access token:", refreshError);

              signOut();
              navigate("/login");
            }
          } else {
            console.log("Token is valid");
            let from = location.state?.from?.pathname || "/";
            navigate(from);
          }
        } catch (err) {
          console.error("Error verifying token:", err.message);
        }
      } catch (error) {
        console.error("Error verifying access token:", error);

        // If there's an error, sign out the user and redirect to the login page
        signOut();
        navigate("/login");
      }
    };

    // Call the function to verify the access token when the component mounts
    verifyAccessToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        signOut,
        authenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
