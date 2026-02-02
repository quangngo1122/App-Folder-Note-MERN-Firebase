import React from "react";
import { createContext } from "react";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged((user) => {
      console.log("[From AuthProvider]", { user });
      if (user?.uid) {
        setUser(user);
        localStorage.setItem("accessToken", user.accessToken);
        return;
      }

      //reset user info --> khi user đăng xuất rồi hay ko tồn tại user đăng nhập
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
      {children}
    </AuthContext.Provider>
  );
}
