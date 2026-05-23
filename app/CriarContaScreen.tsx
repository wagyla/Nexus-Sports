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

const SPORTS: ChipOption[] = [
  { label: 'Corrida', value: 'corrida' },
  { label: 'Tênis', value: 'tenis' },
  { label: 'Vôlei', value: 'volei' },
  { label: 'Ciclismo', value: 'ciclismo' },
  { label: 'Futebol', value: 'futebol' },
  { label: 'Outro', value: 'outro' },
];

export default function CriarContaScreen({ navigation }: any) {
  const [form, setForm] = useState({
    nomeCompleto: '',
    email: '',
    cidade: '',
    senha: '',
  });
  const [esportesFavoritos, setEsportesFavoritos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleEsporte = (value: string) => {
    setEsportesFavoritos((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nomeCompleto.trim()) e.nomeCompleto = 'Informe seu nome completo.';
    if (!form.email.trim()) e.email = 'Informe seu e-mail.';
    if (!form.cidade.trim()) e.cidade = 'Informe sua cidade.';
    if (form.senha.length < 6) e.senha = 'A senha deve ter ao menos 6 caracteres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCriarConta = () => {
    if (!validate()) return;
    // TODO: integrar com backend
    console.log({ ...form, esportesFavoritos });
  };

  const set = (field: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>⚡</Text>
            </View>
            <Text style={styles.appName}>nexus sports</Text>
          </View>

          <FormCard
            title="Criar Conta"
            subtitle="Junte-se à comunidade"
          >
            <FormField
              label="Nome Completo"
              placeholder="Ex: Leonardo Pricken"
              value={form.nomeCompleto}
              onChangeText={set('nomeCompleto')}
              error={errors.nomeCompleto}
              autoCapitalize="words"
            />

            <FormField
              label="E-mail"
              placeholder="Ex: exemplo@gmail.com"
              value={form.email}
              onChangeText={set('email')}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <RowFields>
              <View style={{ flex: 1 }}>
                <FormField
                  label="Cidade"
                  placeholder="Ex: Joinville"
                  value={form.cidade}
                  onChangeText={set('cidade')}
                  error={errors.cidade}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormField
                  label="Senha"
                  placeholder="••••••"
                  value={form.senha}
                  onChangeText={set('senha')}
                  error={errors.senha}
                  secureTextEntry
                />
              </View>
            </RowFields>

            <ChipSelector
              label="Esportes Favoritos"
              options={SPORTS}
              selected={esportesFavoritos}
              onToggle={toggleEsporte}
              containerStyle={{ marginTop: 4 }}
            />

            <PrimaryButton
              title="Criar Conta"
              onPress={handleCriarConta}
              style={{ marginTop: 16 }}
            />
          </FormCard>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
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
    gap: 10,
    marginBottom: 24,
    marginTop: 8,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: TEXT_MUTED,
    fontSize: 14,
  },
  footerLink: {
    color: CYAN,
    fontSize: 14,
    fontWeight: '600',
  },
});
