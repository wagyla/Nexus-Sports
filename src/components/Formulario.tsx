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
  containerStyle,
  style,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused, style]}
        placeholderTextColor="#555"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
      />
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
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.chipsRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.chip, selected.includes(opt.value) && styles.chipActive]}
          onPress={() => onToggle(opt.value)}
          activeOpacity={0.75}
        >
          <Text style={[styles.chipText, selected.includes(opt.value) && styles.chipTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export const RowFields: React.FC<RowFieldsProps> = ({ children, gap = 12 }) => (
  <View style={[styles.rowFields, { gap }]}>{children}</View>
);

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
}) => (
  <TouchableOpacity
    style={[styles.primaryButton, style]}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={disabled}
  >
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#fff',
    // @ts-ignore - web only
    outlineWidth: 0,
  },
  inputFocused: {
    borderColor: '#00FFD1',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#111',
  },
  chipActive: {
    borderColor: '#00FFD1',
    backgroundColor: 'rgba(0,255,209,0.1)',
  },
  chipText: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#00FFD1',
  },
  rowFields: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  primaryButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#00FFD1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
