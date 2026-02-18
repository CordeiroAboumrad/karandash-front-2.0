import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return sessionStorage.getItem("isAuthenticated") === "true";
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
