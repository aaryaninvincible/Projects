import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar, Pressable } from 'react-native';
import { typography } from '../../src/theme/typography';
import { useOrder, Order } from '../../src/context/OrderContext';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function VendorLiveQueue() {
  const { colors } = useThemeSettings();
  const { vendorOrders, updateOrderStatus } = useOrder();
  const { addNotification } = useApp();

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Preparing' ? 'Out for Delivery' : 'Delivered';
    await updateOrderStatus(orderId, nextStatus as Order['status']);
    addNotification('Order Updated', `Order #${orderId.slice(0, 8)} marked as ${nextStatus}`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[typography.h2, styles.title, { color: colors.text }]}>Live Order Queue</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {vendorOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No active orders in queue</Text>
          </View>
        ) : (
          vendorOrders.map((order, idx) => (
            <View key={order.id} style={[styles.queueCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <View style={[styles.queueHeader, { borderBottomColor: colors.border }]}>
                <View>
                  <Text style={[styles.queuePosition, { color: colors.primary }]}>#{idx + 1} in Queue</Text>
                  <Text style={[styles.orderId, { color: colors.textMuted }]}>Order {order.id.slice(0,8).toUpperCase()}</Text>
                </View>
                <Text style={[styles.timeText, { color: colors.textMuted }]}>{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </View>
              
              <View style={[styles.studentInfo, { backgroundColor: colors.background }]}>
                <Text style={[styles.studentPhone, { color: colors.text }]}>📞 +91 XXXXX XXXX (Student)</Text>
              </View>

              <View style={styles.itemsList}>
                {order.items.map((item, i) => (
                  <Text key={i} style={[styles.itemsText, { color: colors.text }]}>
                    {item.quantity}x {item.name}
                  </Text>
                ))}
              </View>
              
              <View style={styles.actionRow}>
                <View style={[styles.statusBadge, order.status === 'Preparing' ? {backgroundColor: 'rgba(245,158,11,0.2)'} : {backgroundColor: 'rgba(16,185,129,0.2)'}]}>
                   <Text style={[styles.statusText, order.status === 'Preparing' ? {color: '#d97706'} : {color: '#10b981'}]}>{order.status}</Text>
                </View>
                <Text style={[styles.totalValue, { color: colors.text }]}>₹{order.total}</Text>
              </View>

              {order.status !== 'Delivered' && (
                <Pressable style={[styles.readyBtn, { backgroundColor: colors.primary }]} onPress={() => handleUpdateStatus(order.id, order.status)}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                  <Text style={styles.readyBtnText}>Mark as {order.status === 'Preparing' ? 'Ready' : 'Delivered'}</Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 16, borderBottomWidth: 1 },
  title: {},
  scroll: { padding: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: {},
  queueCard: { padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1 },
  queueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, paddingBottom: 12, marginBottom: 12 },
  queuePosition: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  orderId: { fontSize: 12 },
  timeText: { fontSize: 12 },
  studentInfo: { padding: 8, borderRadius: 8, marginBottom: 12 },
  studentPhone: { fontWeight: '500', fontSize: 13 },
  itemsList: { marginBottom: 16 },
  itemsText: { fontSize: 15, marginBottom: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { backgroundColor: 'rgba(245, 158, 11, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { color: '#d97706', fontWeight: 'bold' },
  totalValue: { fontWeight: 'bold', fontSize: 18 },
  readyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, marginTop: 4, gap: 8 },
  readyBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 }
});
