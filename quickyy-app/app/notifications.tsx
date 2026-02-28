import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../src/context/AppContext';
import { useThemeSettings } from '../src/context/ThemeContext';

export default function NotificationsScreen() {
  const { colors } = useThemeSettings();
  const { notifications, markNotificationRead } = useApp();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={52} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No notifications yet.</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => markNotificationRead(item.id)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: item.read ? 0.7 : 1,
                },
              ]}>
              <View style={styles.cardTop}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                {!item.read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
              </View>
              <Text style={{ color: colors.textMuted }}>{item.message}</Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  empty: { paddingTop: 90, alignItems: 'center' },
  emptyText: { marginTop: 12 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontWeight: '700', fontSize: 15 },
  dot: { width: 10, height: 10, borderRadius: 6 },
  time: { marginTop: 10, fontSize: 12 },
});
