import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View } from "react-native";
import Loader from '../components/Loader';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F9FAFB" }}>
        <Loader size="lg" color="bg-[#064e3b]" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}
