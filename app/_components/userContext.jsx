"use client";

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import Cookies from "js-cookie";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (token) => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/userProfile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response?.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token) => {
    Cookies.set("token", token, { expires: 7 }); // expires in 7 days
    localStorage.setItem("token", token);
    await fetchUser(token);
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    fetchUser(token);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#FF7F3E" height={35} width={5} />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, login, logout, fetchUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
