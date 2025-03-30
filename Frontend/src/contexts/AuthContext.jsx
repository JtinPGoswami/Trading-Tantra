import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // No destructuring needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null; // Restore token on page load
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds

        if (expirationTime > Date.now()) {
          setUser({ token });

          // Auto logout when token expires
          const timeout = setTimeout(logout, expirationTime - Date.now());
          return () => clearTimeout(timeout);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for authentication
export const useAuth = () => useContext(AuthContext);
