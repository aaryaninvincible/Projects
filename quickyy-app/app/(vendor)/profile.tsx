import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function VendorProfile() {
  const { vendorDetails, logout } = useAuth();
  const router = useRouter();
  const { colors } = useThemeSettings();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[typography.h2, styles.title, { color: colors.text }]}>Vendor Profile</Text>
      </View>
      
      <View style={styles.content}>
        <View style={[styles.shopCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="storefront" size={50} color={colors.primary} style={{marginBottom: 16}} />
          <Text style={[typography.h2, {color: colors.text}]}>{vendorDetails?.name || 'My Canteen'}</Text>
          <Text style={{color: colors.textMuted, marginTop: 4}}>{vendorDetails?.block || 'Campus'}</Text>
          <Text style={{color: colors.textMuted, marginTop: 4}}>{vendorDetails?.phone || 'No phone added'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#dc2626" />
          <Text style={styles.logoutText}>Log Out of Canteen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 16, borderBottomWidth: 1 },
  title: {},
  content: { flex: 1, padding: 16, alignItems: 'center' },
  shopCard: { padding: 32, borderRadius: 20, alignItems: 'center', width: '100%', borderWidth: 1, marginBottom: 40 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#fca5a5' },
  logoutText: { color: '#dc2626', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }
});
