import React from "react";
import { createContext } from "react";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged((user) => {
      console.log("[From AuthProvider]", { user });
      if (user?.uid) {
        setUser(user);
        if (user.accessToken !== localStorage.getItem("accessToken")) {
          localStorage.setItem("accessToken", user.accessToken);
          window.location.reload();
        }
        setIsLoading(false);
        return;
      }

      //reset user info --> khi user đăng xuất rồi hay ko tồn tại user đăng nhập
      setIsLoading(false);
      setUser({});
      localStorage.clear();
      navigate("/login");
    });

    //clear func
    return () => {
      unsubcribed();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <CircularProgress /> : children}
    </AuthContext.Provider>
  );
}
