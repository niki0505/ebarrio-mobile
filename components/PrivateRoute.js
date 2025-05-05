import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Login from "./Login";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigation = useNavigation();

  console.log("Is Authenticated", isAuthenticated);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigation.navigate("Login");
    }
  }, [isAuthenticated, navigation]);

  if (isAuthenticated === null) {
    return null;
  }
  if (!isAuthenticated) {
    return null;
  }

  return element;
};

export default PrivateRoute;
