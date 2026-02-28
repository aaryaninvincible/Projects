import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useApp } from '../../src/context/AppContext';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { profile, averageRating } = useApp();
  const { colors } = useThemeSettings();
  
  const options = [
    { icon: 'person-outline', title: 'Edit Profile', route: '/edit-profile' },
    { icon: 'card-outline', title: 'Payment Methods', route: '/payment-methods' },
    { icon: 'star-outline', title: `My Reviews (${averageRating || 0}★)`, route: '/my-reviews' },
    { icon: 'settings-outline', title: 'Settings', route: '/settings' },
    { icon: 'shield-checkmark-outline', title: 'Permissions', route: '/permissions' },
    { icon: 'notifications-outline', title: 'Notifications', route: '/notifications' },
    { icon: 'log-out-outline', title: 'Logout', color: '#dc2626' },
  ];

  const handleOptionPress = async (opt: any) => {
    if (opt.title === 'Logout') {
      await logout();
      router.replace('/(auth)');
    } else if (opt.route) {
      router.push(opt.route);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={[styles.profileHeader, { borderBottomColor: colors.border }]}>
          <Image 
            source={{ uri: profile.avatar }} 
            style={[styles.avatar, { borderColor: colors.secondary }]} 
          />
          <Text style={[typography.h2, styles.name, { color: colors.text }]}>{profile.name}</Text>
          <Text style={[styles.email, { color: colors.textMuted }]}>{profile.email}</Text>
        </View>

        <View style={styles.optionsList}>
          {options.map((opt, i) => (
            <TouchableOpacity 
               key={i} 
               style={[styles.optionRow, { borderBottomColor: colors.border }]}
               onPress={() => handleOptionPress(opt)}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={opt.icon as any} size={24} color={opt.color || colors.text} />
                <Text style={[styles.optionTitle, { color: colors.text }, opt.color && { color: opt.color }]}>{opt.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  profileHeader: { alignItems: 'center', paddingVertical: 32, borderBottomWidth: 1 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 3 },
  name: { marginBottom: 4 },
  email: {},
  optionsList: { padding: 16 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionTitle: { marginLeft: 16, fontSize: 16, fontWeight: '500' }
});
