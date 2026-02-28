import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { typography } from '../../src/theme/typography';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function StudentLogin() {
  const { loginAsStudent } = useAuth();
  const router = useRouter();
  const { colors } = useThemeSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
         <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.content}>
        <Text style={[typography.h1, styles.title, { color: colors.text }]}>Student Login</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Log in automatically for this demo.</Text>
        
        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={loginAsStudent}>
          <Text style={styles.buttonText}>Continue as Student</Text>
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
  subtitle: { marginBottom: 40 },
  button: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, gap: 10 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 }
});
