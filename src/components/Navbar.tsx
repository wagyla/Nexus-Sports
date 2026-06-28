import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import ModalSelecionarGrupo from "@/src/components/ModalSelecionarGrupo";

type Props = {
  itemAtivo: "feed" | "grupos" | "novoEvento" | "perfil";
};

const Navbar = ({ itemAtivo }: Props) => {
  const insets = useSafeAreaInsets();
  const [modalGrupoVisivel, setModalGrupoVisivel] = useState(false);

  return (
    <>
      <View style={[styles.navbar, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/(app)/feed")}
        >
          <FontAwesomeIcon
            icon={faHouse}
            size={22}
            color={itemAtivo === "feed" ? "#00FFD1" : "#888"}
          />
          <Text style={[styles.navTexto, itemAtivo === "feed" && styles.navTextoAtivo]}>
            Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCentro}
          onPress={() => setModalGrupoVisivel(true)}
        >
          <View style={[styles.navCentroBotao, itemAtivo !== "novoEvento" && styles.navCentroBotaoInativo]}>
            <FontAwesomeIcon
              icon={faPlus}
              size={22}
              color={itemAtivo === "novoEvento" ? "#000" : "#888888"}
            />
          </View>
          <Text style={[styles.navTextoCentro, itemAtivo !== "novoEvento" && styles.navTextoCentroInativo]}>
            Novo Evento
          </Text>
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
          <Text style={[styles.navTexto, itemAtivo === "grupos" && styles.navTextoAtivo]}>
            Grupos
          </Text>
        </TouchableOpacity>
      </View>

      <ModalSelecionarGrupo
        visivel={modalGrupoVisivel}
        onFechar={() => setModalGrupoVisivel(false)}
      />
    </>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
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
  navCentroBotaoInativo: {
    backgroundColor: "#333",
  },
  navTextoCentro: {
    color: "#00FFD1",
    fontSize: 11,
    marginTop: 2,
  },
  navTextoCentroInativo: {
    color: "#888888",
  },
});
