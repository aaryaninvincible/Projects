import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, Platform, StatusBar } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { BannerCarousel } from '../../src/components/BannerCarousel';
import { CategoryList } from '../../src/components/CategoryList';
import { ShopCard } from '../../src/components/ShopCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { firebaseDb } from '../../src/lib/firebase';
import { useApp } from '../../src/context/AppContext';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour mock timer
  const [shops, setShops] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const router = useRouter();
  const { profile } = useApp();
  const { colors } = useThemeSettings();

  useEffect(() => {
    if (!firebaseDb) return;

    // Fetch Shops
    const qShops = query(collection(firebaseDb, 'vendors'));
    const unsubShops = onSnapshot(qShops, (snap) => {
      const liveShops = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShops(liveShops);
    });

    // Fetch Metadatas (Categories/Banners)
    const qMeta = query(collection(firebaseDb, 'app_metadata'));
    const unsubMeta = onSnapshot(qMeta, (snap) => {
      const metas = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const liveBanners = metas.filter(m => m.id.startsWith('banner_'));
      const liveCats = metas.filter(m => m.id.startsWith('category_'));
      setBanners(liveBanners);
      setCategories(liveCats);
    });

    return () => {
      unsubShops();
      unsubMeta();
    };
  }, []);

  const handleShopPress = (shop: any) => {
    router.push({ pathname: '/shop/[id]', params: { id: shop.id } } as any);
  };

  // Safe category filtering
  const filteredShops = selectedCategory === '' 
    ? shops 
    : shops.filter(shop => {
        const cat = categories.find(c => c.id === selectedCategory);
        if (!cat) return true;
        // Check if any shop tag matches the category name
        return shop.tags.some((tag: string) => tag.toLowerCase().includes(cat.name.toLowerCase()));
      });

  useEffect(() => {
     const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
     }, 1000);
     return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[typography.caption, {color: colors.textMuted, marginBottom: 4}]}>Good Morning, {profile.name.split(' ')[0]} 👋</Text>
            <Text style={[typography.h2, {color: colors.text}]}>Craving something?</Text>
          </View>
          <View style={[styles.profileBtn, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <Image 
              source={{ uri: profile.avatar }} 
              style={styles.avatar} 
            />
          </View>
        </View>

        {/* Search Bar Mock */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.primary} />
          <Text style={{color: colors.textMuted, marginLeft: 8, fontSize: 15}}>Search for food, coffee, etc...</Text>
        </View>

        {/* Banners */}
        <BannerCarousel data={banners} />

        {/* Offer Zone Timer */}
        <Animated.View entering={FadeIn.delay(300)} style={styles.offerZone}>
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="flash" size={20} color="#f59e0b" />
              <Text style={styles.offerText}>Flash Deal Ends In: </Text>
           </View>
           <View style={styles.timerBadge}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
           </View>
        </Animated.View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, styles.sectionTitle]}>Categories</Text>
          {selectedCategory !== '' && (
             <Text 
               style={[typography.button, {color: colors.primary}]} 
               onPress={() => setSelectedCategory('')}
             >
               Clear Filter
             </Text>
          )}
        </View>
        <CategoryList 
          data={categories} 
          selectedId={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        {/* Dynamic Shop Filtering Section */}
        {selectedCategory !== '' ? (
           <View style={styles.shopsContainer}>
              <View style={[styles.sectionHeader, {paddingHorizontal: 0}]}>
                <Text style={[typography.h3, styles.sectionTitle]}>Category Results</Text>
              </View>
              {filteredShops.length > 0 ? (
                 filteredShops.map((shop, index) => (
                  <Animated.View key={shop.id} entering={FadeInUp.delay(index * 100).duration(400)}>
                    <ShopCard shop={shop} onPress={() => handleShopPress(shop)} />
                  </Animated.View>
                ))
              ) : (
                <View style={styles.emptyFilter}>
                  <Text style={styles.emptyFilterText}>No shops found for this category.</Text>
                </View>
              )}
           </View>
        ) : (
           <>
              {/* Best Sellers */}
              <View style={styles.sectionHeader}>
                <Text style={[typography.h3, styles.sectionTitle]}>Best Selling Canteens</Text>
                <Text style={[typography.button, styles.seeAll]}>See All</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 20, gap: 16}}>
                 {shops.filter(s => s.reviews > 200).map((shop, i) => (
                    <Animated.View key={`best-${shop.id}`} entering={FadeInUp.delay(i * 100).duration(400)} style={{width: 280}}>
                       <ShopCard shop={shop} onPress={() => handleShopPress(shop)} />
                    </Animated.View>
                 ))}
              </ScrollView>

              {/* Top Rated Canteens */}
              <View style={styles.sectionHeader}>
                <Text style={[typography.h3, styles.sectionTitle]}>Top Rated</Text>
              </View>
              <View style={{paddingHorizontal: 16, paddingBottom: 20}}>
                 {shops.filter(s => s.rating >= 4.5).map((shop, i) => (
                    <Animated.View key={`top-${shop.id}`} entering={FadeInUp.delay(i * 100).duration(400)}>
                       <ShopCard shop={shop} onPress={() => handleShopPress(shop)} />
                    </Animated.View>
                 ))}
              </View>

              {/* More Recommendations */}
              <View style={styles.sectionHeader}>
                <Text style={[typography.h3, styles.sectionTitle]}>More Recommendations</Text>
              </View>
              <View style={{paddingHorizontal: 16, paddingBottom: 40}}>
                 {shops.filter(s => s.rating < 4.5 && s.reviews <= 200).map((shop, i) => (
                    <Animated.View key={`rec-${shop.id}`} entering={FadeInUp.delay(i * 100).duration(400)}>
                       <ShopCard shop={shop} onPress={() => handleShopPress(shop)} />
                    </Animated.View>
                 ))}
                 {shops.filter(s => s.rating < 4.5 && s.reviews <= 200).length === 0 && (
                   <Text style={{color: colors.textMuted, textAlign: 'center', marginVertical: 20}}>You&apos;ve seen them all!</Text>
                 )}
              </View>
           </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    borderWidth: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    color: colors.textMuted,
    marginLeft: 8,
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  shopsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyFilter: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyFilterText: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  offerZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  offerText: { color: '#d97706', fontWeight: 'bold', marginLeft: 6 },
  timerBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  timerText: { color: colors.surface, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }
});
