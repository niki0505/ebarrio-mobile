import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Certificates from "./Certificates";
import CourtReservations from "./CourtReservations";
import { useNavigation } from "@react-navigation/native";

const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated === true) {
      navigation.navigate("BottomTabs");
    }
  }, [isAuthenticated, navigation]);

  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return element;
};

export default PublicRoute;
