import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Props = {
  children: React.ReactNode;
};

export function PrivateRoute({ children }: Props) {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}