import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useCart } from '../../src/context/CartContext';
import { useOrder } from '../../src/context/OrderContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from '../../src/lib/firebase';

const TEMPLATE_MENU = [
  { id: 't1', name: 'Sample Combo Meal', price: 150, desc: 'A placeholder meal combo for testing.', veg: true, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80' },
  { id: 't2', name: 'Sample Drink', price: 50, desc: 'A placeholder refreshing drink.', veg: true, image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&q=80' },
  { id: 't3', name: 'Sample Snack (Non-Veg)', price: 120, desc: 'A placeholder crispy snack.', veg: false, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cb6ac0?w=500&q=80' }
];

export default function ShopScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, items, getCartTotal } = useCart();
  const { orders } = useOrder();
  
  const [shop, setShop] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (!firebaseDb || !id) return;

    // 1. Fetch Shop details once
    const shopRef = doc(firebaseDb, 'vendors', id as string);
    getDoc(shopRef).then((snap) => {
      if (snap.exists()) setShop({ id: snap.id, ...snap.data() });
    });

    // 2. Listen to live Products Subcollection
    const qProducts = query(collection(firebaseDb, 'vendors', id as string, 'products'));
    const unsub = onSnapshot(qProducts, (snap) => {
      const liveItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log(`[FIREBASE] Fetched ${liveItems.length} products for shop: ${id}`);
      setMenuItems(liveItems);
    }, (error) => {
      console.error("[FIREBASE Error] Shop Menu Listener Failed:", error.message);
    });

    return () => unsub();
  }, [id]);

  if (!shop) return null;

  const cartTotal = getCartTotal();
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Fallback to template if menu is strictly empty (after load) or missing
  const activeMenu = (menuItems && menuItems.length > 0) ? menuItems : TEMPLATE_MENU;

  // Dynamic wait time calculation (3 mins per active order in queue)
  const activeOrdersForShop = orders.filter(o => o.shopName === shop.name && o.status === 'Preparing');
  const dynamicWaitTime = `${Math.max(10, activeOrdersForShop.length * 3 + parseInt(shop.time))} mins`;

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image source={{ uri: shop.image }} style={styles.headerImage} />
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeHeader}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.shopInfoCard}>
          <Text style={[typography.h1, styles.shopName]}>{shop.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={16} color="#facc15" />
            <Text style={styles.ratingText}>{shop.rating} ({shop.reviews} reviews)</Text>
            <Text style={styles.dot}>•</Text>
            <View style={styles.timeBadge}>
              <Ionicons name="time" size={14} color={colors.surface} />
              <Text style={styles.timeTextAlert}>{dynamicWaitTime}</Text>
            </View>
          </View>
          <Text style={styles.tagsText}>{shop.tags.join(', ')}</Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={[typography.h2, styles.menuTitle]}>Menu</Text>
          
          {activeMenu.map((item: any, index: number) => (
            <Animated.View key={item.id} style={styles.menuItemRow} entering={FadeInDown.delay(index * 150).duration(400)}>
              <Image source={{ uri: item.image }} style={styles.menuImage} />
              <View style={styles.menuDetails}>
                <View style={styles.row}>
                  <View style={[styles.vegBadge, item.veg ? styles.veg : styles.nonVeg]} />
                  <Text style={[typography.h3, styles.itemName]}>{item.name}</Text>
                </View>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
              </View>
              <Pressable style={styles.addBtn} onPress={() => addToCart(item, shop)}>
                <Ionicons name="add" size={18} color={colors.primary} />
                <Text style={styles.addBtnText}>ADD</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Floating View Cart Button */}
      {cartItemsCount > 0 && (
        <View style={styles.floatingCart}>
          <View>
            <Text style={styles.cartTotalText}>{cartItemsCount} item{cartItemsCount > 1 ? 's' : ''} | ₹{cartTotal}</Text>
            <Text style={styles.cartSubText}>Extra charges may apply</Text>
          </View>
          <Pressable style={styles.viewCartBtn} onPress={() => router.push('/cart')}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.surface} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerImageContainer: { height: 250, position: 'relative' },
  headerImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  safeHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1, marginTop: -30 },
  shopInfoCard: { backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 20, padding: 20, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, borderWidth: 1, borderColor: colors.border },
  shopName: { color: colors.text, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { color: colors.text, marginLeft: 6, fontWeight: 'bold' },
  dot: { color: colors.textMuted, marginHorizontal: 8 },
  timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timeTextAlert: { color: colors.surface, marginLeft: 4, fontWeight: 'bold', fontSize: 12 },
  tagsText: { color: colors.textMuted },
  menuSection: { padding: 16, paddingBottom: 100 },
  menuTitle: { color: colors.text, marginBottom: 16 },
  menuItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 12, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  menuImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  menuDetails: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  vegBadge: { width: 10, height: 10, borderRadius: 2, marginRight: 8, borderWidth: 1 },
  veg: { borderColor: 'green', backgroundColor: 'rgba(0,255,0,0.2)' },
  nonVeg: { borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.2)' },
  itemName: { color: colors.text, fontSize: 16 },
  itemDesc: { color: colors.textMuted, fontSize: 12, marginBottom: 6 },
  itemPrice: { color: colors.text, fontWeight: 'bold' },
  addBtn: { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.primary },
  addBtnText: { color: colors.primary, fontWeight: 'bold', marginLeft: 4 },
  floatingCart: { position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: colors.accent, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 10 },
  cartTotalText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
  cartSubText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 },
  viewCartBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  viewCartText: { color: colors.surface, fontWeight: 'bold', marginRight: 4 }
});
