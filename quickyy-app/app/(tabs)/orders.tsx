import React, { useEffect, useRef } from 'react';
import { Alert, View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../../src/context/OrderContext';
import { useApp } from '../../src/context/AppContext';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function OrdersScreen() {
  const { colors } = useThemeSettings();
  const { orders } = useOrder();
  const { notifications } = useApp();
  const router = useRouter();
  const promptedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const delivered = orders.find((order) => order.status === 'Delivered' && !promptedRef.current.has(order.id));
    if (!delivered) return;

    promptedRef.current.add(delivered.id);
    Alert.alert(
      'Order Delivered',
      `Hope you enjoyed ${delivered.shopName}. Would you like to add a review?`,
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Add Review', onPress: () => router.push('/my-reviews' as any) },
      ],
    );
  }, [orders, router]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[typography.h2, styles.title, { color: colors.text }]}>My Orders</Text>
          <Ionicons name="notifications-outline" size={22} color={colors.text} onPress={() => router.push('/notifications' as any)} />
        </View>

        {/* Mock Notification Panel */}
        {orders.length > 0 && orders[0].status === 'Preparing' && (
          <View style={[styles.notificationBanner, { backgroundColor: colors.accent }]}>
            <Ionicons name="notifications-circle" size={24} color="#ffffff" />
            <Text style={styles.notificationText}>Shop accepted Order {orders[0].id.slice(0,8)}. Prep time ~10m.</Text>
          </View>
        )}

        {notifications.some((n) => !n.read) && (
          <Text style={[styles.unreadText, { color: colors.textMuted }]}>You have unread notifications. Tap the bell above.</Text>
        )}

        <Animated.ScrollView entering={FadeInUp.duration(320)} contentContainerStyle={styles.scroll}>
          
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No orders yet</Text>
            </View>
          ) : (
            orders.map(order => (
              <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.orderHeader, { borderBottomColor: colors.border }]}>
                  <View style={styles.row}>
                    <Ionicons name="restaurant" size={20} color={colors.primary} />
                    <Text style={[typography.h3, styles.shopName, { color: colors.text }]}>{order.shopName}</Text>
                  </View>
                  <Text style={[styles.status, { color: colors.accent }]}>{order.status}</Text>
                </View>
                
                <View style={styles.itemsList}>
                  {order.items.map((item, idx) => (
                    <Text key={idx} style={[styles.itemsText, { color: colors.textMuted }]}>
                      {item.quantity} x {item.name}
                    </Text>
                  ))}
                </View>
                
                <View style={styles.footer}>
                  <Text style={[styles.timeText, { color: colors.textMuted }]}>{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                  <Text style={[styles.price, { color: colors.text }]}>Total: ₹{order.total}</Text>
                </View>
              </View>
            ))
          )}

        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: {},
  scroll: { padding: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16 },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 16,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 12, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  shopName: { marginLeft: 8 },
  status: { fontWeight: 'bold', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12 },
  itemsList: { marginBottom: 16 },
  itemsText: { fontSize: 14, marginBottom: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 12 },
  price: { fontSize: 16, fontWeight: 'bold' },
  notificationBanner: { flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 0, padding: 12, borderRadius: 12 },
  notificationText: { color: '#ffffff', fontWeight: 'bold', marginLeft: 8, fontSize: 14 },
  unreadText: { marginHorizontal: 16, marginTop: 10, fontSize: 12 }
});
