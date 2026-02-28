import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { AppProvider } from '../src/context/AppContext';
import { CartProvider } from '../src/context/CartContext';
import { OrderProvider } from '../src/context/OrderContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider as CustomThemeProvider, useThemeSettings } from '../src/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Inner Layout to consume Auth
function InnerLayout() {
  const { resolvedScheme, colors } = useThemeSettings();
  const { role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationTheme = {
    ...(resolvedScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(resolvedScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      border: colors.border,
      text: colors.text,
      primary: colors.primary,
      notification: colors.secondary,
    },
  };

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inVendorGroup = segments[0] === '(vendor)';
    const studentAllowedStandalone = new Set([
      'shop',
      'edit-profile',
      'settings',
      'payment-methods',
      'permissions',
      'notifications',
      'my-reviews',
      'modal',
    ]);
    const firstSegment = segments[0] ?? '';
    const inStudentStandalone = studentAllowedStandalone.has(firstSegment);

    if (!role && !inAuthGroup) {
      // Redirect to role selection if not logged in
      router.replace('/(auth)');
    } else if (role === 'student' && !inTabsGroup && !inStudentStandalone) {
      // Redirect students only when they enter disallowed route groups
      router.replace('/(tabs)');
    } else if (role === 'vendor' && !inVendorGroup) {
      // Redirect vendor to vendor routes
      router.replace('/(vendor)');
    }
  }, [role, isLoading, segments, router]);

  if (isLoading) return null; // Or a splash screen

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(vendor)" />
        <Stack.Screen name="shop/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: true, title: 'Edit Profile' }} />
        <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
        <Stack.Screen name="payment-methods" options={{ headerShown: true, title: 'Payment Methods' }} />
        <Stack.Screen name="permissions" options={{ headerShown: true, title: 'Permissions' }} />
        <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
        <Stack.Screen name="my-reviews" options={{ headerShown: true, title: 'My Reviews' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <AppProvider>
          <OrderProvider>
            <CartProvider>
              <InnerLayout />
            </CartProvider>
          </OrderProvider>
        </AppProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}
