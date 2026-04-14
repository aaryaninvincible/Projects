import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Pressable, Platform, StatusBar } from 'react-native';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useOrder } from '../src/context/OrderContext';

export default function AdminScreen() {
  const router = useRouter();
  const { orders } = useOrder();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'add'>('orders');
  
  const [newItemParams, setNewItemParams] = useState({ name: '', price: '', desc: '' });

  const handleAddItem = () => {
    if(!newItemParams.name || !newItemParams.price) return alert("Fill in name and price");
    alert(`Mock Item Added to Global State!\n\n${newItemParams.name} - ₹${newItemParams.price}`);
    setNewItemParams({ name: '', price: '', desc: '' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[typography.h2, styles.title]}>Canteen Admin</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabsRow}>
        <Pressable 
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]} 
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>Live Orders</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'add' && styles.activeTab]} 
          onPress={() => setActiveTab('add')}
        >
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>Manage Menu</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'orders' ? (
          <View>
            {orders.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="documents-outline" size={60} color={colors.border} />
                <Text style={styles.emptyText}>No incoming orders</Text>
              </View>
            ) : (
              orders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}># {order.id}</Text>
                    <Text style={styles.statusBadge}>New Order</Text>
                  </View>
                  {order.items.map((item, idx) => (
                    <Text key={idx} style={styles.itemsText}>
                      {item.quantity} x {item.name}
                    </Text>
                  ))}
                  <View style={styles.orderFooter}>
                     <Text style={styles.price}>₹{order.total}</Text>
                     <Pressable style={styles.acceptBtn}>
                        <Text style={styles.acceptText}>Accept</Text>
                     </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={[typography.h3, { marginBottom: 16 }]}>Add New Menu Item</Text>
            
            <Text style={styles.label}>Item Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Masala Dosa" 
              value={newItemParams.name}
              onChangeText={(t) => setNewItemParams({...newItemParams, name: t})}
            />

            <Text style={styles.label}>Price (₹)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 50" 
              keyboardType="numeric"
              value={newItemParams.price}
              onChangeText={(t) => setNewItemParams({...newItemParams, price: t})}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              placeholder="Crispy dosa with potato filling" 
              multiline
              value={newItemParams.desc}
              onChangeText={(t) => setNewItemParams({...newItemParams, desc: t})}
            />

            <Pressable style={styles.submitBtn} onPress={handleAddItem}>
               <Text style={styles.submitText}>Add to Canteen</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  title: { color: colors.text },
  tabsRow: { flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: 'bold' },
  activeTabText: { color: colors.primary },
  content: { flex: 1, padding: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: colors.textMuted, marginTop: 16, fontSize: 16 },
  orderCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: { backgroundColor: colors.accent, color: colors.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: 'bold' },
  itemsText: { color: colors.text, marginBottom: 4 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  price: { fontWeight: 'bold', fontSize: 18 },
  acceptBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8 },
  acceptText: { color: colors.surface, fontWeight: 'bold' },
  formCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.textMuted, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: colors.text, backgroundColor: colors.background },
  submitBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  submitText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 }
});
