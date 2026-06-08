import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

type Props = {
  itemAtivo: "feed" | "grupos" | "Novo Evento";
};

export default function Navbar({ itemAtivo }: Props) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/Feed")}
      >
        <FontAwesomeIcon icon={faHouse} size={22} color="#ffff" />
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
        style={styles.navItem}
        onPress={() => router.push("/grupos")}
      >
        <FontAwesomeIcon icon={faUsers} size={22} color="#ffff" />
        <Text
          style={[
            styles.navTexto,
            itemAtivo === "grupos" && styles.navTextoAtivo,
          ]}
        >
          Grupos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/CriarEventoScreen")}
      >
        <FontAwesomeIcon icon={faPlus} size={22} color="#ffff" />
        <Text
          style={[
            styles.navTexto,
            itemAtivo === "Novo Evento" && styles.navTextoAtivo,
          ]}
        >
          Novo Evento
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { flex: 1, alignItems: "center" },
  navIcone: { fontSize: 20 },
  navTexto: { color: "#ffffff", fontSize: 11, marginTop: 2 },
  navTextoAtivo: { color: "#4ecca3" },
});
