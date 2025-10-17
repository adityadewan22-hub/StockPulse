import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface authContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const authContext = createContext<authContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setToken(newToken);
  };

  return (
    <authContext.Provider value={{ token, setToken: handleSetToken }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("useAuth must be inside authProvider");
  return context;
};
