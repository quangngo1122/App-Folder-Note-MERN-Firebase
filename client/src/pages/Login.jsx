import React, { useContext } from "react";
import { Button, Typography } from "@mui/material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, Navigate } from "react-router-dom";
import { graphQLRequest } from "../utils/request";
export default function Login() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { user } = useContext(AuthContext);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { uid, displayName },
    } = await signInWithPopup(auth, provider);
    const { data } = await graphQLRequest({
      query: `mutation register($uid: String!, $name: String!) {
                register(uid: $uid, name: $name) {
                  id
                  name
                }
              }`,
      variables: {
        uid,
        name: displayName,
      },
    });
    console.log("register", { data });
  };

  if (localStorage.getItem("accessToken")) {
    // navigate("/"); // có thể xãy ra issue vì use hook useNavigate bên ngoài useEffect, nên bth ko trong useEffect thì dùng component <Navigate/>
    return <Navigate to="/" />;
  }

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: "10px" }}>
        Welcome to Note App
      </Typography>
      <Button variant="outlined" onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
    </>
  );
}
