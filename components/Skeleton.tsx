import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useThemeColor } from './Themed';

export function Skeleton({ width, height, borderRadius = 4, style }: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const skeletonBg = useThemeColor({}, 'muted');

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: skeletonBg,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  const borderCol = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');

  return (
    <View style={[styles.card, { borderColor: borderCol, backgroundColor: cardBg }]}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Skeleton width="60%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={12} borderRadius={4} />
        </View>
        <Skeleton width={70} height={20} borderRadius={12} />
      </View>
      <View style={styles.body}>
        <Skeleton width="85%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width="50%" height={14} borderRadius={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  body: {
    marginTop: 8,
  },
});
