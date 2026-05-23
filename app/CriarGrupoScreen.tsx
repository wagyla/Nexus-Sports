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

export default function CriarGrupoScreen({ navigation }: any) {
  const [form, setForm] = useState({
    nomeGrupo: '',
    descricao: '',
    data: '',
    horario: '',
    local: '',
    vagas: '',
    contatoEmail: '',
  });
  const [esportes, setEsportes] = useState<string[]>([]);
  const [nivel, setNivel] = useState<string[]>([]);
  const [membros, setMembros] = useState<string[]>([]);
  const [novoMembro, setNovoMembro] = useState('');
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

  const adicionarMembro = () => {
    const email = novoMembro.trim();
    if (email && !membros.includes(email)) {
      setMembros((prev) => [...prev, email]);
      setNovoMembro('');
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nomeGrupo.trim()) e.nomeGrupo = 'Informe o nome do grupo.';
    if (!form.data.trim()) e.data = 'Informe a data.';
    if (!form.local.trim()) e.local = 'Informe o local.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCriarGrupo = () => {
    if (!validate()) return;
    console.log({ ...form, esportes, nivel, membros });
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
            <Text style={styles.headerTitle}>Criar Grupo</Text>
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
              label="Nome do Grupo"
              placeholder="Ex: Futebolistas da Prainha"
              value={form.nomeGrupo}
              onChangeText={set('nomeGrupo')}
              error={errors.nomeGrupo}
            />

            {}
            <FormField
              label="Descrição"
              placeholder="Ex: Corrida de Sem"
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
                  placeholder="20"
                  value={form.vagas}
                  onChangeText={set('vagas')}
                  keyboardType="numeric"
                />
              </View>
            </RowFields>

            {}
            <Text style={styles.sectionLabel}>ADICIONAR MEMBROS</Text>
            <View style={styles.addMemberRow}>
              <FormField
                placeholder="Ex: seuemail@gmail.com"
                value={novoMembro}
                onChangeText={setNovoMembro}
                containerStyle={{ flex: 1, marginBottom: 0 }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.addBtn} onPress={adicionarMembro}>
                <Text style={styles.addBtnText}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>

            {membros.length > 0 && (
              <View style={styles.membersList}>
                {membros.map((m) => (
                  <View key={m} style={styles.memberBadge}>
                    <Text style={styles.memberText}>{m}</Text>
                  </View>
                ))}
              </View>
            )}

            <PrimaryButton
              title="Criar Grupo"
              onPress={handleCriarGrupo}
              style={{ marginTop: 20 }}
            />
          </FormCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { themas } from '../global/themes';

const CYAN       = themas.colors.primary;
const BG         = '#0A0E1A';
const TEXT       = themas.colors.white;
const TEXT_MUTED = '#718096';
const SURFACE2   = '#222839';
const BORDER     = '#2D3448';

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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_MUTED,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addBtn: {
    backgroundColor: 'rgba(0,255,255,0.15)',
    borderWidth: 1,
    borderColor: CYAN,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 12,
  },
  addBtnText: {
    color: CYAN,
    fontSize: 13,
    fontWeight: '600',
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  memberBadge: {
    backgroundColor: SURFACE2,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: BORDER,
  },
  memberText: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
});
