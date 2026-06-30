import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../contexts/AuthContext';
import { HomeIcon, FilmIcon, TvIcon, UserIcon, SearchIcon } from '../../components/icons';
import { Colors } from '../../constants/theme';

function TabBarBackground() {
  return (
    <BlurView
      tint="dark"
      intensity={60}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function TabsLayout() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, loading]);

  if (!isAuthenticated) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: Colors.glassBorder,
          backgroundColor: 'transparent',
          elevation: 0,
          height: 64,
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'DMSans_500Medium',
          fontSize: 10,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Movies',
          tabBarIcon: ({ color, size }) => <FilmIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tv"
        options={{
          title: 'TV Shows',
          tabBarIcon: ({ color, size }) => <TvIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <UserIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
