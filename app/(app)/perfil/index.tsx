import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/src/componentes/Navbar";
import ModalEventosPerfil from "@/src/componentes/ModalEventosPerfil";
import ModalGruposPerfil from "@/src/componentes/ModalGruposPerfil";
import { useAuth } from "@/src/contextos/AuthContext";
import { corDoEsporte, iniciaisDoNome } from "@/src/componentes/helpers";
import { getMeusEventosPaginados, countMeusEventos } from "@/src/api/eventos";
import { getMeusGrupos, countMeusGrupos } from "@/src/api/grupos";
import type { EventoSupabase } from "@/src/types";

const POR_PAGINA = 10;

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const ICONE_MDI: Record<string, string> = {
  corrida: "run",
  ciclismo: "bike",
  tenis: "tennis",
  volei: "volleyball",
  futebol: "soccer",
  natacao: "swim",
  outro: "trophy-variant",
};

const iconeMDI = (esporte: string): string =>
  ICONE_MDI[esporte?.toLowerCase()] ?? "trophy-variant";

const formatarData = (dataHora: string): string => {
  const iso = (dataHora ?? "").split("T")[0];
  const [, mes, dia] = iso.split("-");
  return dia && mes ? `${dia} ${MESES[Number(mes) - 1]}` : "";
};

const isPassado = (dataHora: string): boolean => new Date(dataHora) < new Date();

const Profile = () => {
  const { user, signOut } = useAuth();

  const handleSair = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const nome: string = user?.user_metadata?.nome ?? "";
  const cidade: string = user?.user_metadata?.cidade ?? "";
  const iniciais = iniciaisDoNome(nome);
  const esportesRaw: string[] = user?.user_metadata?.esportes ?? [];
  const esportesFavoritos = esportesRaw.map((e) => ({
    nome: e.charAt(0).toUpperCase() + e.slice(1),
    cor: corDoEsporte(e),
  }));

  const [totalEventos, setTotalEventos] = useState(0);
  const [totalGrupos, setTotalGrupos] = useState(0);
  const [eventos, setEventos] = useState<EventoSupabase[]>([]);
  const [grupos, setGrupos] = useState<{ nome: string; esporte: string; membros: number }[]>([]);
  const [pagina, setPagina] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [temMais, setTemMais] = useState(true);
  const [modalEventosVisivel, setModalEventosVisivel] = useState(false);
  const [modalGruposVisivel, setModalGruposVisivel] = useState(false);

  useEffect(() => {
    if (!user) return;
    void carregarDados();
  }, [user?.id]);

  const carregarDados = async () => {
    setCarregando(true);
    const [resContEventos, resContGrupos, resEventos, resGrupos] = await Promise.all([
      countMeusEventos(user!.id),
      countMeusGrupos(user!.id),
      getMeusEventosPaginados(user!.id, 0, POR_PAGINA),
      getMeusGrupos(user!.id),
    ]);

    if (!resContEventos.error) setTotalEventos(resContEventos.data ?? 0);
    if (!resContGrupos.error) setTotalGrupos(resContGrupos.data ?? 0);

    if (!resEventos.error) {
      const lista = resEventos.data ?? [];
      setEventos(lista);
      setTemMais(lista.length === POR_PAGINA);
      setPagina(0);
    }

    if (!resGrupos.error) {
      setGrupos(
        (resGrupos.data ?? []).map((g) => ({
          nome: g.nome ?? "",
          esporte: g.esporte ?? "outro",
          membros: 0,
        }))
      );
    }

    setCarregando(false);
  };

  const carregarMais = async () => {
    if (carregandoMais || !temMais || !user) return;
    setCarregandoMais(true);
    const novaPagina = pagina + 1;
    const res = await getMeusEventosPaginados(user.id, novaPagina, POR_PAGINA);
    if (!res.error) {
      const novos = res.data ?? [];
      setEventos((prev) => [...prev, ...novos]);
      setTemMais(novos.length === POR_PAGINA);
      setPagina(novaPagina);
    }
    setCarregandoMais(false);
  };

  const eventoParaAtividade = (e: EventoSupabase) => ({
    titulo: e.nome ?? "",
    data: formatarData(e.data_hora),
    distancia: "",
    status: isPassado(e.data_hora) ? "Concluído" : "Agendado",
  });

  const renderEvento = ({ item }: { item: EventoSupabase }) => {
    const passado = isPassado(item.data_hora);
    const cor = corDoEsporte(item.esporte);
    return (
      <View style={styles.card}>
        <View style={[styles.cardIcone, { backgroundColor: cor + "22" }]}>
          <MaterialCommunityIcons
            name={iconeMDI(item.esporte) as any}
            size={22}
            color={cor}
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitulo}>{item.nome}</Text>
          <Text style={styles.cardDetalhe}>{formatarData(item.data_hora)}</Text>
        </View>
        <View style={[styles.tag, passado ? styles.tagConcluido : styles.tagAgendado]}>
          <Text style={[styles.tagTexto, passado ? styles.tagTextoConcluido : styles.tagTextoAgendado]}>
            {passado ? "Concluído" : "Agendado"}
          </Text>
        </View>
      </View>
    );
  };

  const cabecalho = (
    <>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{iniciais}</Text>
        </View>
        <Text style={styles.nome}>{nome}</Text>
        {!!cidade && <Text style={styles.cidade}>{cidade}</Text>}
        <TouchableOpacity style={styles.botaoSair} onPress={handleSair} activeOpacity={0.7}>
          <MaterialCommunityIcons name="logout" size={12} color="#555" />
          <Text style={styles.botaoSairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.estatistica}>
        <TouchableOpacity
          style={styles.cartaoEstat}
          onPress={() => setModalEventosVisivel(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.estatNumero}>{totalEventos}</Text>
          <Text style={styles.estatRotulo}>Eventos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartaoEstat}
          onPress={() => setModalGruposVisivel(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.estatNumero, { color: "#FF8800" }]}>{totalGrupos}</Text>
          <Text style={styles.estatRotulo}>Grupos</Text>
        </TouchableOpacity>
      </View>

      {esportesFavoritos.length > 0 && (
        <>
          <Text style={styles.secaoTitulo}>Esportes Favoritos</Text>
          <View style={styles.esportes}>
            {esportesFavoritos.map((esporte, index) => (
              <View
                key={index}
                style={[styles.esporteTag, { backgroundColor: esporte.cor + "33" }]}
              >
                <Text style={[styles.esporteTexto, { color: esporte.cor }]}>
                  {esporte.nome}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {totalEventos > 0 && (
        <Text style={styles.secaoTitulo}>Atividades Recentes</Text>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <View style={styles.cabecalhoTela}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.push("/(app)/feed")}
        >
          <Text style={styles.botaoVoltarTexto}>‹</Text>
          <Text style={styles.titulo}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => router.push("/(app)/perfil/edit")}
        >
          <FontAwesomeIcon icon={faPencil} size={14} color="#00FFD1" />
          <Text style={styles.botaoEditarTexto}>Editar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={eventos}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderEvento}
        ListHeaderComponent={cabecalho}
        ListFooterComponent={
          carregandoMais ? (
            <ActivityIndicator color="#00FFD1" style={{ marginVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          !carregando ? (
            <View style={styles.vazioContainer}>
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={48}
                color="#333"
              />
              <Text style={styles.vazioTexto}>Você não participou de nenhum evento recentemente</Text>
            </View>
          ) : null
        }
        onEndReached={carregarMais}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Navbar itemAtivo="perfil" />

      <ModalEventosPerfil
        visivel={modalEventosVisivel}
        onFechar={() => setModalEventosVisivel(false)}
        eventos={eventos.map(eventoParaAtividade)}
      />
      <ModalGruposPerfil
        visivel={modalGruposVisivel}
        onFechar={() => setModalGruposVisivel(false)}
        grupos={grupos}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingTop: 60,
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  cabecalhoTela: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  botaoVoltarTexto: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
    marginTop: -4,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  botaoEditar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  botaoEditarTexto: {
    color: "#00FFD1",
    fontSize: 14,
    fontWeight: "600",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00FFD133",
    borderWidth: 1.5,
    borderColor: "#00FFD1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarTexto: {
    color: "#00FFD1",
    fontSize: 26,
    fontWeight: "bold",
  },
  nome: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cidade: {
    color: "#888888",
    fontSize: 13,
    marginTop: 4,
  },
  estatistica: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  cartaoEstat: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  estatNumero: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  estatRotulo: {
    color: "#888888",
    fontSize: 12,
    marginTop: 4,
  },
  secaoTitulo: {
    color: "#888888",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },
  esportes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  esporteTag: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  esporteTexto: {
    fontSize: 13,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitulo: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  cardDetalhe: {
    color: "#888888",
    fontSize: 13,
  },
  tag: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagTexto: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tagConcluido: {
    backgroundColor: "#00FFD133",
  },
  tagTextoConcluido: {
    color: "#00FFD1",
  },
  tagAgendado: {
    backgroundColor: "#FF880033",
  },
  tagTextoAgendado: {
    color: "#FF8800",
  },
  vazioContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  vazioTexto: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
  },
  botaoSair: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
  },
  botaoSairTexto: {
    color: "#555",
    fontSize: 12,
  },
});
