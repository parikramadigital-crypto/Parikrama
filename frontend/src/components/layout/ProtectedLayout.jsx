import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store";

const ProtectedLayout = ({ children, role }) => {
  const { user } = useAuthStore();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch (admin/user)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedLayout;
