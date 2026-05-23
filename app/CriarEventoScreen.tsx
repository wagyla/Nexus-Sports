import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  FormField,
  FormCard,
  ChipSelector,
  PrimaryButton,
  RowFields,
  ChipOption,
} from '@/src/componentes/Formulario';

const ESPORTES: ChipOption[] = [
  { label: 'Corrida', value: 'corrida' },
  { label: 'Tênis', value: 'tenis' },
  { label: 'Vôlei', value: 'volei' },
  { label: 'Futebol', value: 'futebol' },
  { label: 'Natação', value: 'natacao' },
  { label: '+Outro', value: 'outro' },
];

const NIVEIS: ChipOption[] = [
  { label: 'Iniciante', value: 'iniciante' },
  { label: 'Recreação', value: 'recreacao' },
  { label: 'Avançado', value: 'avancado' },
  { label: '+Outro', value: 'outro' },
];

export default function CriarEventoScreen({ navigation }: any) {
  const [form, setForm] = useState({
    nomeEvento: '',
    grupoOrganizador: '',
    descricao: '',
    data: '',
    horario: '',
    local: '',
    vagas: '',
  });
  const [esportes, setEsportes] = useState<string[]>([]);
  const [nivel, setNivel] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleEsporte = (value: string) =>
    setEsportes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const toggleNivel = (value: string) =>
    setNivel((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nomeEvento.trim()) e.nomeEvento = 'Informe o nome do evento.';
    if (!form.data.trim()) e.data = 'Informe a data.';
    if (!form.local.trim()) e.local = 'Informe o local.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCriarEvento = () => {
    if (!validate()) return;
    console.log({ ...form, esportes, nivel });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Criar Evento</Text>
          </View>

          <FormCard title="">
            {}
            <ChipSelector
              label="Esportes"
              options={ESPORTES}
              selected={esportes}
              onToggle={toggleEsporte}
            />

            {}
            <ChipSelector
              label="Nível"
              options={NIVEIS}
              selected={nivel}
              onToggle={toggleNivel}
            />

            {}
            <FormField
              label="Nome do Evento"
              placeholder="Ex: Futebolistas da Prainha"
              value={form.nomeEvento}
              onChangeText={set('nomeEvento')}
              error={errors.nomeEvento}
            />

            {}
            <FormField
              label="Grupo Organizador"
              placeholder="Ex: Varejão"
              value={form.grupoOrganizador}
              onChangeText={set('grupoOrganizador')}
            />

            {}
            <FormField
              label="Descrição"
              placeholder="Ex: Corrida de 5km"
              value={form.descricao}
              onChangeText={set('descricao')}
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: 'top' }}
            />

            {}
            <RowFields>
              <View style={{ flex: 1 }}>
                <FormField
                  label="Data"
                  placeholder="dd/mm/aaaa"
                  value={form.data}
                  onChangeText={set('data')}
                  error={errors.data}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormField
                  label="Horário"
                  placeholder="00:00"
                  value={form.horario}
                  onChangeText={set('horario')}
                  keyboardType="numeric"
                />
              </View>
            </RowFields>

            {}
            <RowFields>
              <View style={{ flex: 1 }}>
                <FormField
                  label="Local"
                  placeholder="Ex: Praia"
                  value={form.local}
                  onChangeText={set('local')}
                  error={errors.local}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <FormField
                  label="Vagas"
                  placeholder="25"
                  value={form.vagas}
                  onChangeText={set('vagas')}
                  keyboardType="numeric"
                />
              </View>
            </RowFields>

            <PrimaryButton
              title="Criar Evento"
              onPress={handleCriarEvento}
              style={{ marginTop: 12 }}
            />
          </FormCard>

          {}
          <View style={styles.tabHint}>
            <View style={styles.tabDot} />
            <View style={styles.tabDot} />
            <View style={[styles.tabDot, styles.tabDotActive]} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { themas } from '../global/themes';

const CYAN = themas.colors.primary;
const BG   = '#0A0E1A';
const TEXT = themas.colors.white;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    marginTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: CYAN,
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: 0.3,
  },
  tabHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D3448',
  },
  tabDotActive: {
    backgroundColor: CYAN,
    width: 24,
    borderRadius: 4,
  },
});
