import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';


export interface FormFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
}

export interface ChipOption {
  label: string;
  value: string;
}

export interface ChipSelectorProps {
  label?: string;
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
  containerStyle?: object;
}

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: object;
}

export interface RowFieldsProps {
  children: React.ReactNode;
  gap?: number;
}


export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor="#4A5568"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};


export const ChipSelector: React.FC<ChipSelectorProps> = ({
  label,
  options,
  selected,
  onToggle,
  containerStyle,
}) => (
  <View style={[styles.fieldContainer, containerStyle]}>
    {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
    <View style={styles.chipsRow}>
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onToggle(opt.value)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// ─── RowFields ────────────────────────────────────────────────────────────────

export const RowFields: React.FC<RowFieldsProps> = ({ children, gap = 10 }) => (
  <View style={[styles.rowFields, { gap }]}>{children}</View>
);

// ─── PrimaryButton ────────────────────────────────────────────────────────────

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
}) => (
  <TouchableOpacity
    style={[styles.primaryButton, disabled && styles.primaryButtonDisabled, style]}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={disabled}
  >
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

// ─── FormCard ─────────────────────────────────────────────────────────────────

export interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const FormCard: React.FC<FormCardProps> = ({ title, subtitle, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
    <View style={styles.cardBody}>{children}</View>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

import { themas } from '@/global/themes';

const CYAN       = themas.colors.primary;   // '#00FFFF'
const ERROR      = themas.colors.red;       // '#FF6666'
const SURFACE    = '#1A1F2E';
const SURFACE2   = '#222839';
const BORDER     = '#2D3448';
const BORDER_FOCUS = themas.colors.primary;
const TEXT       = themas.colors.white;     // '#ffff'  (lembre de corrigir para '#ffffff' no themes)
const TEXT_MUTED = '#718096';

export const styles = StyleSheet.create({
  // Field
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_MUTED,
    marginBottom: 5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: SURFACE2,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: TEXT,
  },
  inputFocused: {
    borderColor: BORDER_FOCUS,
    shadowColor: CYAN,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  inputError: {
    borderColor: ERROR,
  },
  errorText: {
    fontSize: 11,
    color: ERROR,
    marginTop: 4,
  },
  // Chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE2,
  },
  chipActive: {
    borderColor: CYAN,
    backgroundColor: 'rgba(0,255,255,0.12)',
  },
  chipText: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  chipTextActive: {
    color: CYAN,
  },
  // Row
  rowFields: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  // Button
  primaryButton: {
    backgroundColor: CYAN,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: CYAN,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#0A0E1A',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Card
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 16,
  },
  cardBody: {
    marginTop: 10,
  },
});
