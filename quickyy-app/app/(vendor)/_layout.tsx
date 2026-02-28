import { Tabs as ExpoTabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function VendorTabLayout() {
  const { colors, resolvedScheme } = useThemeSettings();
  const glassTint = resolvedScheme === 'dark' ? 'dark' : 'light';

  return (
    <ExpoTabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
        tabBarBackground: () => (
          <>
            <BlurView
              intensity={Platform.OS === 'ios' ? 65 : 45}
              tint={glassTint}
              style={{ ...StyleSheet.absoluteFillObject, borderRadius: 18, overflow: 'hidden' }}
            />
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                borderRadius: 18,
                backgroundColor: resolvedScheme === 'dark' ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.62)',
                borderWidth: 1,
                borderColor: `${colors.border}cc`,
              }}
            />
          </>
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 10,
          marginHorizontal: 12,
          marginBottom: 12,
          borderRadius: 18,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}>
      <ExpoTabs.Screen
        name="index"
        options={{
          title: 'Live Queue',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="cms"
        options={{
          title: 'Manage Shop',
          tabBarIcon: ({ color }) => <Ionicons name="storefront" size={24} color={color} />,
        }}
      />
      <ExpoTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </ExpoTabs>
  );
}
