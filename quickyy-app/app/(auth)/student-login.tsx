import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function StudentLogin() {
  const { loginAsStudent } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
         <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <View style={styles.content}>
        <Text style={[typography.h1, styles.title]}>Student Login</Text>
        <Text style={styles.subtitle}>Log in automatically for this demo.</Text>
        
        <Pressable style={styles.button} onPress={loginAsStudent}>
          <Text style={styles.buttonText}>Continue as Student</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.surface} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  backBtn: { padding: 16, marginTop: 10 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { color: colors.text, marginBottom: 8 },
  subtitle: { color: colors.textMuted, marginBottom: 40 },
  button: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, gap: 10 },
  buttonText: { color: colors.surface, fontWeight: 'bold', fontSize: 18 }
});
