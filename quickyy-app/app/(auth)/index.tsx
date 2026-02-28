import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { typography } from '../../src/theme/typography';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function RoleSelection() {
  const router = useRouter();
  const { colors } = useThemeSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[typography.h1, styles.title, { color: colors.primary }]}>Welcome to Quickyy</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>How would you like to use the app today?</Text>
      </View>

      <View style={styles.options}>
        <Pressable 
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} 
          onPress={() => router.push('/(auth)/student-login')}
        >
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}} style={styles.cardImage} />
          <Text style={[typography.h2, styles.cardTitle, { color: colors.text }]}>I am a Student</Text>
          <Text style={[styles.cardDesc, { color: colors.textMuted }]}>Order food, skip lines, & view offers</Text>
        </Pressable>

        <Pressable 
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} 
          onPress={() => router.push('/(auth)/vendor-register')}
        >
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png'}} style={styles.cardImage} />
          <Text style={[typography.h2, styles.cardTitle, { color: colors.text }]}>I own a Canteen</Text>
          <Text style={[styles.cardDesc, { color: colors.textMuted }]}>Manage orders, queue, & products</Text>
        </Pressable>

        <Pressable style={[styles.secondaryButton, { borderColor: colors.primary }]} onPress={() => router.push('/(auth)/vendor-login' as any)}>
          <Text style={[styles.secondaryText, { color: colors.primary }]}>Already a Vendor? Sign In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 60 },
  title: { textAlign: 'center', fontSize: 32 },
  subtitle: { marginTop: 8, fontSize: 16 },
  options: { gap: 24 },
  card: { padding: 24, borderRadius: 20, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, borderWidth: 1 },
  cardImage: { width: 80, height: 80, marginBottom: 16 },
  cardTitle: { marginBottom: 4 },
  cardDesc: { textAlign: 'center' },
  secondaryButton: { borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  secondaryText: { fontWeight: '700' },
});
