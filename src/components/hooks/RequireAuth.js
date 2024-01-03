import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

function RequireAuth({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      let accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(accessToken);

      if (decoded.exp < Date.now() / 1000) {
        console.log("Token has expired");
        setUser(null);
      } else {
        console.log("Token is valid");
        setUser(decoded);
      }

      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return children;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}

export default RequireAuth;
