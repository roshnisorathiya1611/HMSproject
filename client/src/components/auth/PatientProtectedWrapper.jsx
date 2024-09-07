import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function PatientProtectedWrapper({ children }) {
  const { user } = useSelector((state) => state.authReducers);
  if (user == null) return <Navigate to="/" />;
  else if (user && user.role != "patient") return <Navigate to="/" />;
  else return children;
}
