import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Inbox from "./pages/Inbox";
import Privacy from "./pages/Privacy";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="grid h-screen place-items-center text-ink-subtle">Loading…</div>;
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<Login />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/*" element={<Protected><Inbox /></Protected>} />
    </Routes>
  );
}