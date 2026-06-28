import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

type Props = {
  itemAtivo: "feed" | "grupos" | "novoEvento" | "perfil";
  onNovoEvento?: () => void;
};

const Navbar = ({ itemAtivo, onNovoEvento }: Props) => (
  <View style={styles.navbar}>
    <TouchableOpacity
      style={styles.navItem}
      onPress={() => router.push("/(app)/feed")}
    >
      <FontAwesomeIcon
        icon={faHouse}
        size={22}
        color={itemAtivo === "feed" ? "#00FFD1" : "#888"}
      />
      <Text
        style={[
          styles.navTexto,
          itemAtivo === "feed" && styles.navTextoAtivo,
        ]}
      >
        Feed
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.navCentro}
      onPress={onNovoEvento ?? (() => router.push("/(app)/events/new"))}
    >
      <View style={styles.navCentroBotao}>
        <FontAwesomeIcon icon={faPlus} size={22} color="#000" />
      </View>
      <Text style={styles.navTextoCentro}>Novo Evento</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.navItem}
      onPress={() => router.push("/(app)/groups")}
    >
      <FontAwesomeIcon
        icon={faUsers}
        size={22}
        color={itemAtivo === "grupos" ? "#00FFD1" : "#888"}
      />
      <Text
        style={[
          styles.navTexto,
          itemAtivo === "grupos" && styles.navTextoAtivo,
        ]}
      >
        Grupos
      </Text>
    </TouchableOpacity>
  </View>
);

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingVertical: 10,
    paddingBottom: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  navTexto: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
  },
  navTextoAtivo: {
    color: "#00FFD1",
  },
  navCentro: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    marginTop: -24,
  },
  navCentroBotao: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#00FFD1",
    alignItems: "center",
    justifyContent: "center",
  },
  navTextoCentro: {
    color: "#00FFD1",
    fontSize: 11,
    marginTop: 2,
  },
});
