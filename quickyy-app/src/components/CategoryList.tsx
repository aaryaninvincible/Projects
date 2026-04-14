import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../theme/typography';
import { useThemeSettings } from '../context/ThemeContext';

type CategoryListProps = {
  data: any[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export const CategoryList = ({ data, selectedId, onSelect }: CategoryListProps) => {
  const { colors } = useThemeSettings();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {data.map((cat) => {
        const isSelected = selectedId === cat.id;
        return (
          <Pressable
            key={cat.id}
            style={[styles.item, isSelected && styles.selectedItem]}
            onPress={() => onSelect(cat.id)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}>
              <Ionicons 
                name={cat.icon as any} 
                size={22} 
                color={isSelected ? colors.surface : colors.text} 
              />
            </View>
            <Text
              style={[
                styles.name,
                { color: colors.textMuted },
                isSelected && { color: colors.primary },
                typography.caption,
              ]}>
              {cat.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  item: {
    alignItems: 'center',
    marginRight: 20,
  },
  selectedItem: {
    opacity: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {},
  selectedName: { fontWeight: 'bold' }
});
