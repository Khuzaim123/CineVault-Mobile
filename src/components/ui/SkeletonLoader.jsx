import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/theme';

export function SkeletonLoader({ width, height, style, borderRadius = 8 }) {
  const animValue = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: Colors.surface,
          opacity: animValue,
        },
        style,
      ]}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonLoader width={130} height={195} borderRadius={12} />
      <SkeletonLoader width={100} height={12} style={{ marginTop: 8 }} borderRadius={4} />
      <SkeletonLoader width={60} height={10} style={{ marginTop: 4 }} borderRadius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 12,
  },
});
