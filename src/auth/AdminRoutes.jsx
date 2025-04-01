import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const AdminRoutes = () => {
  const { user } = useAuth();
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
