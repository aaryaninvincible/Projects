import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeSettings } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { mode, colors, setMode } = useThemeSettings();

  const isDark = mode === 'dark';

  const handleToggle = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <Pressable
      onPress={handleToggle}
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: isDark ? '#0b1220' : '#fff7ed' }]}>
        <Ionicons name={isDark ? 'moon' : 'sunny'} size={16} color={isDark ? '#93c5fd' : '#f59e0b'} />
      </View>
      <Text style={[styles.text, { color: colors.text }]}>{isDark ? 'Dark' : 'Light'}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 13,
  },
});
