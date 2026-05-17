import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" replace />;

  return children;
}