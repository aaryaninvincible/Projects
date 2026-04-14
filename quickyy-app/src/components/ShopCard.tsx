import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../theme/typography';
import { useThemeSettings } from '../context/ThemeContext';

type ShopCardProps = {
  shop: any;
  onPress: () => void;
};

export const ShopCard = ({ shop, onPress }: ShopCardProps) => {
  const { colors } = useThemeSettings();

  return (
    <Pressable style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress}>
      <Image source={{ uri: shop.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={[typography.h3, styles.name, { color: colors.text }]}>{shop.name}</Text>
          <View style={[styles.ratingBadge, { backgroundColor: colors.accent }]}>
            <Ionicons name="star" size={14} color="#facc15" />
            <Text style={styles.ratingText}>{shop.rating}</Text>
          </View>
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.timeTag}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.timeText, { color: colors.textMuted }]}>{shop.time}</Text>
          </View>
          <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
          <Text style={[styles.tagsText, { color: colors.textMuted }]}>{shop.tags.join(', ')}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {},
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    marginLeft: 4,
  },
  dot: { marginHorizontal: 8 },
  tagsText: { fontSize: 13 }
});
