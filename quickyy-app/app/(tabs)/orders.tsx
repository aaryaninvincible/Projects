import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../../src/context/OrderContext';
import { useApp } from '../../src/context/AppContext';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const { orders } = useOrder();
  const { notifications } = useApp();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[typography.h2, styles.title]}>My Orders</Text>
          <Ionicons name="notifications-outline" size={22} color={colors.text} onPress={() => router.push('/notifications' as any)} />
        </View>

        {/* Mock Notification Panel */}
        {orders.length > 0 && orders[0].status === 'Preparing' && (
          <View style={styles.notificationBanner}>
            <Ionicons name="notifications-circle" size={24} color={colors.surface} />
            <Text style={styles.notificationText}>Shop accepted Order {orders[0].id.slice(0,8)}. Prep time ~10m.</Text>
          </View>
        )}

        {notifications.some((n) => !n.read) && (
          <Text style={styles.unreadText}>You have unread notifications. Tap the bell above.</Text>
        )}

        <ScrollView contentContainerStyle={styles.scroll}>
          
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color={colors.border} />
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.row}>
                    <Ionicons name="restaurant" size={20} color={colors.primary} />
                    <Text style={[typography.h3, styles.shopName]}>{order.shopName}</Text>
                  </View>
                  <Text style={styles.status}>{order.status}</Text>
                </View>
                
                <View style={styles.itemsList}>
                  {order.items.map((item, idx) => (
                    <Text key={idx} style={styles.itemsText}>
                      {item.quantity} x {item.name}
                    </Text>
                  ))}
                </View>
                
                <View style={styles.footer}>
                  <Text style={styles.timeText}>{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                  <Text style={styles.price}>Total: ₹{order.total}</Text>
                </View>
              </View>
            ))
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text },
  scroll: { padding: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: colors.textMuted, marginTop: 16, fontSize: 16 },
  orderCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 16,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  shopName: { color: colors.text, marginLeft: 8 },
  status: { color: colors.accent, fontWeight: 'bold', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12 },
  itemsList: { marginBottom: 16 },
  itemsText: { color: colors.textMuted, fontSize: 14, marginBottom: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { color: colors.textMuted, fontSize: 12 },
  price: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  notificationBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, margin: 16, marginBottom: 0, padding: 12, borderRadius: 12 },
  notificationText: { color: colors.surface, fontWeight: 'bold', marginLeft: 8, fontSize: 14 },
  unreadText: { color: colors.textMuted, marginHorizontal: 16, marginTop: 10, fontSize: 12 }
});
