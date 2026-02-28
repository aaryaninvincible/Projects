import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, StatusBar, Pressable } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useOrder, Order } from '../../src/context/OrderContext';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';

export default function VendorLiveQueue() {
  const { vendorOrders, updateOrderStatus } = useOrder();
  const { addNotification } = useApp();

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Preparing' ? 'Out for Delivery' : 'Delivered';
    await updateOrderStatus(orderId, nextStatus as Order['status']);
    addNotification('Order Updated', `Order #${orderId.slice(0, 8)} marked as ${nextStatus}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title]}>Live Order Queue</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {vendorOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No active orders in queue</Text>
          </View>
        ) : (
          vendorOrders.map((order, idx) => (
            <View key={order.id} style={styles.queueCard}>
              <View style={styles.queueHeader}>
                <View>
                  <Text style={styles.queuePosition}>#{idx + 1} in Queue</Text>
                  <Text style={styles.orderId}>Order {order.id.slice(0,8).toUpperCase()}</Text>
                </View>
                <Text style={styles.timeText}>{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </View>
              
              <View style={styles.studentInfo}>
                <Text style={styles.studentPhone}>📞 +91 XXXXX XXXX (Student)</Text>
              </View>

              <View style={styles.itemsList}>
                {order.items.map((item, i) => (
                  <Text key={i} style={styles.itemsText}>
                    {item.quantity}x {item.name}
                  </Text>
                ))}
              </View>
              
              <View style={styles.actionRow}>
                <View style={[styles.statusBadge, order.status === 'Preparing' ? {backgroundColor: 'rgba(245,158,11,0.2)'} : {backgroundColor: 'rgba(16,185,129,0.2)'}]}>
                   <Text style={[styles.statusText, order.status === 'Preparing' ? {color: '#d97706'} : {color: '#10b981'}]}>{order.status}</Text>
                </View>
                <Text style={styles.totalValue}>₹{order.total}</Text>
              </View>

              {order.status !== 'Delivered' && (
                <Pressable style={styles.readyBtn} onPress={() => handleUpdateStatus(order.id, order.status)}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.surface} />
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
  safeArea: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text },
  scroll: { padding: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: colors.textMuted },
  queueCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1, borderColor: colors.primary },
  queueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 12 },
  queuePosition: { color: colors.primary, fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  orderId: { color: colors.textMuted, fontSize: 12 },
  timeText: { color: colors.textMuted, fontSize: 12 },
  studentInfo: { backgroundColor: colors.background, padding: 8, borderRadius: 8, marginBottom: 12 },
  studentPhone: { color: colors.text, fontWeight: '500', fontSize: 13 },
  itemsList: { marginBottom: 16 },
  itemsText: { color: colors.text, fontSize: 15, marginBottom: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { backgroundColor: 'rgba(245, 158, 11, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { color: '#d97706', fontWeight: 'bold' },
  totalValue: { fontWeight: 'bold', fontSize: 18, color: colors.text },
  readyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 8, marginTop: 4, gap: 8 },
  readyBtnText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 }
});
