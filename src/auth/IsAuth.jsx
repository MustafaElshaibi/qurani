import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();


function IsAuth() {
  const token = cookies.get("auth-token");
  return token ? (<Outlet />) : (<Navigate to={'/login'} replace={true} />)
}

export default IsAuth