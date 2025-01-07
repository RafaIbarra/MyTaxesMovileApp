import React from "react";
import { StyleSheet, View } from "react-native";
import Navigation from "./Navigation";

import QRScanner from "./Componentes/QRScanner";

export default function AppContent() {
  return (
    <View style={styles.container}>
      <QRScanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red", 
    alignItems: "center",
    justifyContent: "center",
  },
});
