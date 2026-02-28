import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.85;
const BANNER_MARGIN = 16;
const SNAP_INTERVAL = BANNER_WIDTH + BANNER_MARGIN;

type BannerCarouselProps = {
  data: any[];
};

export const BannerCarousel = ({ data }: BannerCarouselProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data.length === 0) return;
    const intervalId = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= data.length) {
        nextIndex = 0; // wrap around
      }
      scrollRef.current?.scrollTo({ x: nextIndex * SNAP_INTERVAL, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000); // 3 seconds per banner

    return () => clearInterval(intervalId);
  }, [currentIndex, data.length]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / SNAP_INTERVAL);
          setCurrentIndex(index);
        }}
      >
        {data.map((banner) => (
          <View key={banner.id} style={styles.bannerContainer}>
            <Image source={{ uri: banner.image }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.title}>{banner.title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    height: 160,
    marginRight: BANNER_MARGIN,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  }
});
