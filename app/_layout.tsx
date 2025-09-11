import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import "./global.css";
import { useEffect } from "react";
import { AuthProvider } from '../context/AuthContext'; // AuthProvider 추가

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Figtree-Regular": require("../assets/fonts/Figtree-Regular.ttf"),
    "Figtree-Bold": require("../assets/fonts/Figtree-Bold.ttf"),
    "Figtree-ExtraBold": require("../assets/fonts/Figtree-ExtraBold.ttf"),
    "Figtree-Medium": require("../assets/fonts/Figtree-Medium.ttf"),
    "Figtree-Light": require("../assets/fonts/Figtree-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}