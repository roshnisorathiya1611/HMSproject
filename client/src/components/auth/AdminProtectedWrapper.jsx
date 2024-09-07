import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AdminProtectedWrapper({ children }) {
  const { user } = useSelector((state) => state.authReducers);
  if (user == null) return <Navigate to="/" />;
  else if (user && user.role != "admin") return <Navigate to="/" />;
  else return children;
}
