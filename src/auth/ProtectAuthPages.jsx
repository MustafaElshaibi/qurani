import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const ProtectAuthPages = () => {
  const isAuthenticated = cookies.get("auth-token");  

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default ProtectAuthPages;