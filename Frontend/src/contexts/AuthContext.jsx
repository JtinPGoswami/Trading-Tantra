import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null; // ✅ Decode token on first load
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    let token = localStorage.getItem("token");

    if (!token) {
      try {
        const { data } = await axios.get("http://localhost:3000/api/auth/user", {
          withCredentials: true,
        });

        if (data.success && data.token) {
          token = data.token;
          setUser(jwtDecode(token)); 
          localStorage.setItem("token", token);
          // ✅ Decode and set user info
        }
      } catch (error) {
        console.error("Error fetching user token:", error);
      }
    } else {
      try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000;

        if (expirationTime > Date.now()) {
          setUser(decoded); // ✅ Store user info instead of `{ token }`
          const timeout = setTimeout(logout, expirationTime - Date.now());
          return () => clearTimeout(timeout);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser(jwtDecode(token)); // ✅ Decode and store user info
    navigate("/dashboard", { replace: true });
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }

    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
