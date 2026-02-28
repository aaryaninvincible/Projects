import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApp } from '../src/context/AppContext';
import { useThemeSettings } from '../src/context/ThemeContext';

type MethodType = 'UPI' | 'Card' | 'Cash' | 'Wallet';

export default function PaymentMethodsScreen() {
  const { colors } = useThemeSettings();
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useApp();
  const [type, setType] = useState<MethodType>('UPI');
  const [label, setLabel] = useState('');
  const [details, setDetails] = useState('');

  const handleAdd = async () => {
    if (!label.trim() || !details.trim()) return;
    await addPaymentMethod({ type, label: label.trim(), details: details.trim() });
    setLabel('');
    setDetails('');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>Saved Methods</Text>
        {paymentMethods.map((method) => (
          <View key={method.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardTop}>
              <View>
                <Text style={[styles.methodLabel, { color: colors.text }]}>{method.label}</Text>
                <Text style={{ color: colors.textMuted }}>{method.type} • {method.details}</Text>
              </View>
              {method.isDefault && <Text style={[styles.defaultTag, { color: colors.accent }]}>Default</Text>}
            </View>
            <View style={styles.actions}>
              {!method.isDefault && (
                <Pressable onPress={() => setDefaultPaymentMethod(method.id)}>
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>Set Default</Text>
                </Pressable>
              )}
              <Pressable onPress={() => removePaymentMethod(method.id)}>
                <Text style={{ color: colors.danger, fontWeight: '700' }}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={[styles.heading, { color: colors.text, marginTop: 12 }]}>Add Method</Text>
        <View style={styles.typeRow}>
          {(['UPI', 'Card', 'Cash', 'Wallet'] as MethodType[]).map((item) => {
            const active = type === item;
            return (
              <Pressable
                key={item}
                onPress={() => setType(item)}
                style={[
                  styles.typeChip,
                  { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.surface },
                ]}>
                <Text style={{ color: active ? '#fff' : colors.text }}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          placeholder="Label (e.g. Personal UPI)"
          placeholderTextColor={colors.textMuted}
          value={label}
          onChangeText={setLabel}
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
        />
        <TextInput
          placeholder="Details (e.g. aryan@upi / **** 1234)"
          placeholderTextColor={colors.textMuted}
          value={details}
          onChangeText={setDetails}
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
        />

        <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={handleAdd}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.addText}>Add Payment Method</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  methodLabel: { fontWeight: '700', fontSize: 15, marginBottom: 2 },
  defaultTag: { fontWeight: '700' },
  actions: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  typeChip: { borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12 },
  addBtn: { borderRadius: 10, padding: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  addText: { color: '#fff', fontWeight: '700' },
});
