import { createContext, useContext, useEffect, useState } from "react";
import { api, clearTokens, getTokens, saveTokens } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getTokens()) {
      setLoading(false);
      return;
    }
    api("/auth/me/")
      .then(setUser)
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = (tokens) => {
    saveTokens(tokens);
    return api("/auth/me/").then(setUser);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);