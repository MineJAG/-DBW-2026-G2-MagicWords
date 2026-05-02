import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/home" replace />;

  return children;
}