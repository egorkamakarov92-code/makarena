import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '../src/store/gameStore';

export default function RootLayout() {
  const loadGame = useGameStore((s) => s.loadGame);

  useEffect(() => {
    loadGame();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
