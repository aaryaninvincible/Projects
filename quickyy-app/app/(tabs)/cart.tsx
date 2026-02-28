import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../src/context/CartContext';
import { useOrder } from '../../src/context/OrderContext';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';

export default function CartScreen() {
  const { addNotification } = useApp();
  const { items, getCartTotal, removeFromCart, addToCart, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const router = useRouter();
  const total = getCartTotal();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    await placeOrder({
      shopName: items[0].shopName,
      items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      total: total + 20, // adding fixed delivery fee
    }, items[0].shopId);

    addNotification('Order Confirmed', `Your order from ${items[0].shopName} is now being prepared.`);
    
    clearCart();
    
    // Switch to orders tab
    router.push('/orders');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[typography.h2, styles.title]}>Your Cart</Text>
          </View>
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={80} color={colors.border} />
            <Text style={[typography.h3, styles.emptyText]}>It&apos;s empty here</Text>
            <Text style={[typography.body, styles.subText]}>Add some delicious food to get started!</Text>
            <Pressable style={styles.browseBtn} onPress={() => router.push('/')}>
               <Text style={styles.browseBtnText}>Browse Restaurants</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[typography.h2, styles.title]}>Your Cart</Text>
          <Text style={styles.headerShopName}>{items[0].shopName}</Text>
        </View>

        <ScrollView style={styles.scroll}>
          <View style={styles.itemsCard}>
            {items.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={[styles.vegBadge, styles.veg]} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
                
                <View style={styles.quantityControls}>
                  <Pressable style={styles.qBtn} onPress={() => removeFromCart(item.id)}>
                    <Ionicons name="remove" size={16} color={colors.primary} />
                  </Pressable>
                  <Text style={styles.qText}>{item.quantity}</Text>
                  <Pressable style={styles.qBtn} onPress={() => addToCart(item, {id: item.shopId, name: item.shopName})}>
                    <Ionicons name="add" size={16} color={colors.primary} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.billCard}>
            <Text style={[typography.h3, {marginBottom: 16}]}>Bill Details</Text>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{total}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹20</Text>
            </View>
            <View style={[styles.billRow, styles.billTotal]}>
              <Text style={styles.billTotalLabel}>To Pay</Text>
              <Text style={styles.billTotalValue}>₹{total + 20}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>PROCEED TO PAY</Text>
            <Text style={styles.checkoutTotal}>₹{total + 20}</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  title: { color: colors.text },
  headerShopName: { color: colors.textMuted, marginTop: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { color: colors.text, marginTop: 16 },
  subText: { color: colors.textMuted, textAlign: 'center', marginTop: 8 },
  browseBtn: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: colors.primary, borderRadius: 8 },
  browseBtnText: { color: colors.surface, fontWeight: 'bold' },
  scroll: { flex: 1, padding: 16 },
  itemsCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  vegBadge: { width: 12, height: 12, borderWidth: 1, borderRadius: 2, marginRight: 12 },
  veg: { borderColor: 'green', backgroundColor: 'rgba(0,128,0,0.1)' },
  itemDetails: { flex: 1 },
  itemName: { color: colors.text, fontSize: 16, marginBottom: 4 },
  itemPrice: { color: colors.textMuted, fontSize: 14 },
  quantityControls: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.primary, borderRadius: 8, backgroundColor: '#fff0f0' },
  qBtn: { padding: 8 },
  qText: { paddingHorizontal: 8, fontWeight: 'bold', color: colors.primary },
  billCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 32, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: { color: colors.textMuted },
  billValue: { color: colors.text },
  billTotal: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  billTotalLabel: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
  billTotalValue: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
  footer: { padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  checkoutBtn: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
  checkoutTotal: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
});
