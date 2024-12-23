import { createContext, useContext, useEffect, useState } from "react";
import { LogoutUser } from "../queries/authQueries";

interface User {
  id: string
  userName: string;
  email: string;
  roles: string[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    try {
      await LogoutUser();
    } catch (error) {
      console.error("An error occurred while trying to log user out", error);
      localStorage.removeItem("accessToken");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
