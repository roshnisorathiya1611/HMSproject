import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function DoctorProtectedWrapper({ children }) {
  const { user } = useSelector((state) => state.authReducers);
  if (user == null) return <Navigate to="/" />;
  else if (user && user.role != "doctor") return <Navigate to="/" />;
  else return children;
}
