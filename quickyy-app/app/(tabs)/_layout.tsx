import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { Ionicons } from '@expo/vector-icons';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function TabLayout() {
  const { colors, resolvedScheme } = useThemeSettings();
  const glassTint = resolvedScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
        headerShown: false,
        animation: 'shift',
        sceneStyle: { backgroundColor: colors.background },
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
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            marginHorizontal: 12,
            marginBottom: 12,
            borderRadius: 18,
            height: 64,
            paddingTop: 8,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            borderWidth: 0,
          },
          default: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 12,
            marginHorizontal: 12,
            marginBottom: 12,
            borderRadius: 18,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            overflow: 'hidden',
            borderWidth: 0,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <Ionicons name="receipt" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
