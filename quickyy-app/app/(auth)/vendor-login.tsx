import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { typography } from '../../src/theme/typography';
import { useAuth } from '../../src/context/AuthContext';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function VendorLoginScreen() {
  const router = useRouter();
  const { loginVendor } = useAuth();
  const { colors } = useThemeSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginVendor(email.trim(), password);
    } catch {
      Alert.alert('Login failed', 'Check credentials or Firebase config and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.content}>
        <Text style={[typography.h1, styles.title, { color: colors.text }]}>Vendor Login</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Use your registered canteen account credentials.</Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin}>
          <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In as Vendor'}</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { padding: 16, marginTop: 10 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
});
