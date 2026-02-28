import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type ShopCardProps = {
  shop: any;
  onPress: () => void;
};

export const ShopCard = ({ shop, onPress }: ShopCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: shop.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={[typography.h3, styles.name]}>{shop.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#facc15" />
            <Text style={styles.ratingText}>{shop.rating}</Text>
          </View>
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.timeTag}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.timeText}>{shop.time}</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.tagsText}>{shop.tags.join(', ')}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
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
  name: {
    color: colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: colors.surface,
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
    color: colors.textMuted,
    fontSize: 13,
    marginLeft: 4,
  },
  dot: {
    color: colors.textMuted,
    marginHorizontal: 8,
  },
  tagsText: {
    color: colors.textMuted,
    fontSize: 13,
  }
});
