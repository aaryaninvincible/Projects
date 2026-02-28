import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { useThemeSettings } from '../src/context/ThemeContext';

type ThemeOption = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, setMode } = useThemeSettings();
  const { settings, updateSettings } = useApp();

  const themeOptions: ThemeOption[] = ['light', 'dark', 'system'];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <View style={styles.rowWrap}>
          {themeOptions.map((theme) => {
            const selected = mode === theme;
            return (
              <Pressable
                key={theme}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: selected ? colors.primary : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => {
                  setMode(theme);
                  updateSettings({ themeMode: theme });
                }}>
                <Text style={{ color: selected ? '#fff' : colors.text, fontWeight: '700' }}>{theme.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <SettingToggle
          label="Order Updates"
          value={settings.orderNotifications}
          onChange={(value) => updateSettings({ orderNotifications: value })}
          colors={colors}
        />
        <SettingToggle
          label="Promotions"
          value={settings.promoNotifications}
          onChange={(value) => updateSettings({ promoNotifications: value })}
          colors={colors}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Customization</Text>
        <SettingToggle
          label="Sound Effects"
          value={settings.soundEnabled}
          onChange={(value) => updateSettings({ soundEnabled: value })}
          colors={colors}
        />
        <SettingToggle
          label="Biometric Lock"
          value={settings.biometricLock}
          onChange={(value) => updateSettings({ biometricLock: value })}
          colors={colors}
        />
        <SettingToggle
          label="Location Services"
          value={settings.locationEnabled}
          onChange={(value) => updateSettings({ locationEnabled: value })}
          colors={colors}
        />
      </View>

      <Pressable style={[styles.linkRow, { borderColor: colors.border }]} onPress={() => router.push('/permissions' as any)}>
        <View style={styles.linkLeft}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.text} />
          <Text style={[styles.linkText, { color: colors.text }]}>Permissions</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
    </SafeAreaView>
  );
}

function SettingToggle({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  colors: ReturnType<typeof useThemeSettings>['colors'];
}) {
  return (
    <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.toggleLabel, { color: colors.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} thumbColor={value ? colors.primary : '#9ca3af'} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  rowWrap: { flexDirection: 'row', gap: 10 },
  themeChip: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  toggleLabel: { fontSize: 15, fontWeight: '600' },
  linkRow: { borderWidth: 1, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  linkLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkText: { fontSize: 15, fontWeight: '700' },
});
