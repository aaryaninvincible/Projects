import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Platform, StatusBar } from 'react-native';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../src/context/CartContext';
import { useOrder } from '../../src/context/OrderContext';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function CartScreen() {
  const { colors } = useThemeSettings();
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.container}>
          <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[typography.h2, styles.title, { color: colors.text }]}>Your Cart</Text>
          </View>
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={80} color={colors.border} />
            <Text style={[typography.h3, styles.emptyText, { color: colors.text }]}>It&apos;s empty here</Text>
            <Text style={[typography.body, styles.subText, { color: colors.textMuted }]}>Add some delicious food to get started!</Text>
            <Pressable style={[styles.browseBtn, { backgroundColor: colors.primary }]} onPress={() => router.push('/')}>
               <Text style={styles.browseBtnText}>Browse Restaurants</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[typography.h2, styles.title, { color: colors.text }]}>Your Cart</Text>
          <Text style={[styles.headerShopName, { color: colors.textMuted }]}>{items[0].shopName}</Text>
        </View>

        <Animated.ScrollView entering={FadeInUp.duration(300)} style={styles.scroll}>
          <View style={[styles.itemsCard, { backgroundColor: colors.surface }]}>
            {items.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={[styles.vegBadge, styles.veg]} />
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.itemPrice, { color: colors.textMuted }]}>₹{item.price * item.quantity}</Text>
                </View>
                
                <View style={[styles.quantityControls, { borderColor: colors.primary }]}>
                  <Pressable style={styles.qBtn} onPress={() => removeFromCart(item.id)}>
                    <Ionicons name="remove" size={16} color={colors.primary} />
                  </Pressable>
                  <Text style={[styles.qText, { color: colors.primary }]}>{item.quantity}</Text>
                  <Pressable style={styles.qBtn} onPress={() => addToCart(item, {id: item.shopId, name: item.shopName})}>
                    <Ionicons name="add" size={16} color={colors.primary} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.billCard, { backgroundColor: colors.surface }]}>
            <Text style={[typography.h3, {marginBottom: 16, color: colors.text}]}>Bill Details</Text>
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.textMuted }]}>Item Total</Text>
              <Text style={[styles.billValue, { color: colors.text }]}>₹{total}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.textMuted }]}>Delivery Fee</Text>
              <Text style={[styles.billValue, { color: colors.text }]}>₹20</Text>
            </View>
            <View style={[styles.billRow, styles.billTotal, { borderTopColor: colors.border }]}>
              <Text style={[styles.billTotalLabel, { color: colors.text }]}>To Pay</Text>
              <Text style={[styles.billTotalValue, { color: colors.text }]}>₹{total + 20}</Text>
            </View>
          </View>
        </Animated.ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Pressable style={[styles.checkoutBtn, { backgroundColor: colors.primary }]} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>PROCEED TO PAY</Text>
            <Text style={styles.checkoutTotal}>₹{total + 20}</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1 },
  title: {},
  headerShopName: { marginTop: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { marginTop: 16 },
  subText: { textAlign: 'center', marginTop: 8 },
  browseBtn: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  browseBtnText: { color: '#fff', fontWeight: 'bold' },
  scroll: { flex: 1, padding: 16 },
  itemsCard: { borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  vegBadge: { width: 12, height: 12, borderWidth: 1, borderRadius: 2, marginRight: 12 },
  veg: { borderColor: 'green', backgroundColor: 'rgba(0,128,0,0.1)' },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, marginBottom: 4 },
  itemPrice: { fontSize: 14 },
  quantityControls: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, backgroundColor: '#fff0f0' },
  qBtn: { padding: 8 },
  qText: { paddingHorizontal: 8, fontWeight: 'bold' },
  billCard: { borderRadius: 16, padding: 16, marginBottom: 32, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billLabel: {},
  billValue: {},
  billTotal: { marginTop: 8, paddingTop: 16, borderTopWidth: 1 },
  billTotalLabel: { fontWeight: 'bold', fontSize: 16 },
  billTotalValue: { fontWeight: 'bold', fontSize: 16 },
  footer: { padding: 16, borderTopWidth: 1 },
  checkoutBtn: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  checkoutTotal: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
