import { View, Text, TouchableOpacity } from "react-native";
import styles from "../feedStyle";

type Props = {
  filtros: string[];
  filtroAtivo: string;
  onSelectFiltro: (filtro: string) => void;
};

const FeedFiltros = ({ filtros, filtroAtivo, onSelectFiltro }: Props) => (
  <View style={styles.filtros}>
    {filtros.map((f) => (
      <TouchableOpacity
        key={f}
        style={[styles.tag, filtroAtivo === f && styles.tagAtiva]}
        onPress={() => onSelectFiltro(f)}
      >
        <Text style={filtroAtivo === f ? styles.tagTextoAtivo : styles.tagTexto}>
          {f}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default FeedFiltros;
