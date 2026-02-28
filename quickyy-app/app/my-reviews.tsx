import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { shops } from '../src/data/mockData';
import { useApp } from '../src/context/AppContext';
import { useThemeSettings } from '../src/context/ThemeContext';

export default function MyReviewsScreen() {
  const { colors } = useThemeSettings();
  const { reviews, addReview, averageRating } = useApp();
  const [shopId, setShopId] = useState(shops[0].id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const selectedShop = useMemo(() => shops.find((shop) => shop.id === shopId) ?? shops[0], [shopId]);

  const submitReview = async () => {
    if (!comment.trim()) return;
    await addReview({
      shopId: selectedShop.id,
      shopName: selectedShop.name,
      rating,
      comment: comment.trim(),
    });
    setComment('');
    setRating(5);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.summary, { color: colors.text }]}>
          Your Average Rating: <Text style={{ color: colors.primary }}>{averageRating || 0}★</Text>
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Write a Review</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shopRow}>
          {shops.map((shop) => {
            const active = shop.id === selectedShop.id;
            return (
              <Pressable
                key={shop.id}
                onPress={() => setShopId(shop.id)}
                style={[
                  styles.shopChip,
                  { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.surface },
                ]}>
                <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>{shop.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)} style={[styles.star, { borderColor: colors.border }]}>
              <Text style={{ color: star <= rating ? '#facc15' : colors.textMuted, fontSize: 24 }}>★</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          placeholder="Share your experience..."
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          multiline
          value={comment}
          onChangeText={setComment}
        />

        <Pressable style={[styles.submit, { backgroundColor: colors.primary }]} onPress={submitReview}>
          <Text style={styles.submitText}>Submit Review</Text>
        </Pressable>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Your Review History</Text>
        {reviews.length === 0 && <Text style={{ color: colors.textMuted }}>No reviews added yet.</Text>}
        {reviews.map((item) => (
          <View key={item.id} style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.reviewTop}>
              <Text style={[styles.shopName, { color: colors.text }]}>{item.shopName}</Text>
              <Text style={{ color: '#facc15', fontWeight: '700' }}>{item.rating}★</Text>
            </View>
            <Text style={{ color: colors.textMuted }}>{item.comment}</Text>
            <Text style={[styles.reviewTime, { color: colors.textMuted }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  summary: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 10 },
  shopRow: { gap: 8, marginBottom: 12 },
  shopChip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  ratingRow: { flexDirection: 'row', marginBottom: 12 },
  star: { borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8, marginRight: 8 },
  input: { borderWidth: 1, borderRadius: 12, minHeight: 100, padding: 12, textAlignVertical: 'top' },
  submit: { marginTop: 12, borderRadius: 10, alignItems: 'center', padding: 14 },
  submitText: { color: '#fff', fontWeight: '700' },
  reviewCard: { borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 10 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  shopName: { fontWeight: '700' },
  reviewTime: { marginTop: 8, fontSize: 12 },
});
