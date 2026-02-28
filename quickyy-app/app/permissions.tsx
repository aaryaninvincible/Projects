import React from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { useApp } from '../src/context/AppContext';
import { useThemeSettings } from '../src/context/ThemeContext';

export default function PermissionsScreen() {
  const { colors } = useThemeSettings();
  const { permissions, updatePermission } = useApp();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {(['location', 'camera', 'mediaLibrary', 'notifications'] as const).map((name) => (
        <View key={name} style={[styles.row, { borderBottomColor: colors.border }]}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>{formatName(name)}</Text>
            <Text style={{ color: colors.textMuted }}>Toggle app access for {formatName(name).toLowerCase()}.</Text>
          </View>
          <Switch
            value={permissions[name]}
            onValueChange={(next) => updatePermission(name, next)}
            thumbColor={permissions[name] ? colors.primary : '#9ca3af'}
          />
        </View>
      ))}
    </SafeAreaView>
  );
}

const formatName = (name: string) => {
  if (name === 'mediaLibrary') return 'Media Library';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 16 },
  row: { paddingVertical: 14, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
});
