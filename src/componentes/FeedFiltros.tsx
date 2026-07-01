import { ScrollView, Text, TouchableOpacity } from "react-native";
import styles from "@/src/estilos/feed.styles";

type Props = {
  filtros: string[];
  filtroAtivo: string;
  onSelectFiltro: (filtro: string) => void;
};

const FeedFiltros = ({ filtros, filtroAtivo, onSelectFiltro }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filtros}
    style={{ marginBottom: 20, flexGrow: 0 }}
  >
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
  </ScrollView>
);

export default FeedFiltros;
