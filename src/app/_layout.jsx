import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { AuthProvider } from '../contexts/AuthContext';
import { Colors } from '../constants/theme';

// Set the Android window/system background to match our dark theme.
// This is the REAL fix for white flash — it sets the color behind all React views.
SystemUI.setBackgroundColorAsync(Colors.background);

SplashScreen.preventAutoHideAsync();

const DARK_BG = { backgroundColor: Colors.background };
const SLIDE_OPTS = { animation: 'slide_from_right', contentStyle: DARK_BG };

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    // Outermost View with dark background — prevents any white root view showing
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AuthProvider>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <Stack
          // sceneContainerStyle wraps every scene — catches gaps between screens
          sceneContainerStyle={DARK_BG}
          screenOptions={{
            headerShown: false,
            contentStyle: DARK_BG,
            cardStyle: DARK_BG,
            cardOverlayEnabled: false,
            cardShadowEnabled: false,
            animationEnabled: true,
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'none', contentStyle: DARK_BG }} />
          <Stack.Screen name="(auth)" options={{ animation: 'fade', contentStyle: DARK_BG }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade', contentStyle: DARK_BG }} />
          <Stack.Screen name="movie/[id]" options={SLIDE_OPTS} />
          <Stack.Screen name="tv/[id]" options={SLIDE_OPTS} />
          <Stack.Screen name="actor/[id]" options={SLIDE_OPTS} />
          <Stack.Screen name="search" options={SLIDE_OPTS} />
          <Stack.Screen name="edit-profile" options={SLIDE_OPTS} />
          <Stack.Screen
            name="player"
            options={{
              animation: 'fade',
              presentation: 'fullScreenModal',
              contentStyle: { backgroundColor: '#000' },
              cardStyle: { backgroundColor: '#000' },
            }}
          />
        </Stack>
      </AuthProvider>
    </View>
  );
}
