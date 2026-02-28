import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { typography } from '../../src/theme/typography';
import { colors } from '../../src/theme/colors';

export default function RoleSelection() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.h1, styles.title]}>Welcome to Quickyy</Text>
        <Text style={styles.subtitle}>How would you like to use the app today?</Text>
      </View>

      <View style={styles.options}>
        <Pressable 
          style={styles.card} 
          onPress={() => router.push('/(auth)/student-login')}
        >
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}} style={styles.cardImage} />
          <Text style={[typography.h2, styles.cardTitle]}>I am a Student</Text>
          <Text style={styles.cardDesc}>Order food, skip lines, & view offers</Text>
        </Pressable>

        <Pressable 
          style={styles.card} 
          onPress={() => router.push('/(auth)/vendor-register')}
        >
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png'}} style={styles.cardImage} />
          <Text style={[typography.h2, styles.cardTitle]}>I own a Canteen</Text>
          <Text style={styles.cardDesc}>Manage orders, queue, & products</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/(auth)/vendor-login' as any)}>
          <Text style={styles.secondaryText}>Already a Vendor? Sign In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 60 },
  title: { color: colors.primary, textAlign: 'center', fontSize: 32 },
  subtitle: { color: colors.textMuted, marginTop: 8, fontSize: 16 },
  options: { gap: 24 },
  card: { backgroundColor: colors.surface, padding: 24, borderRadius: 20, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, borderWidth: 1, borderColor: colors.border },
  cardImage: { width: 80, height: 80, marginBottom: 16 },
  cardTitle: { color: colors.text, marginBottom: 4 },
  cardDesc: { color: colors.textMuted, textAlign: 'center' },
  secondaryButton: { borderColor: colors.primary, borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  secondaryText: { color: colors.primary, fontWeight: '700' },
});
