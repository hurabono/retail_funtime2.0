import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import "./global.css";
import { useEffect } from "react";
import { AuthProvider, useAuth } from '../context/AuthContext';

// AuthProvider 내부에서 라우팅을 처리하는 핵심 컴포넌트
const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 인증 상태 로딩이 끝나면 라우팅 로직 실행
    if (loading) return;

    // 현재 경로가 (root) 그룹 안에 있는지 확인 (로그인 후 접근하는 메인 앱 영역)
    const inAppGroup = segments[0] === '(root)';

    if (user && !inAppGroup) {
      // --- [수정 시작] ---
      // 1. 로그인 상태이고, 메인 앱 영역에 있지 않다면
      //    -> user.role에 따라 다른 홈 화면으로 강제 이동합니다.
      if (user.role === 'manager') {
        router.replace('/(root)/(managerTabs)'); // 매니저용 탭으로 이동
      } else {
        router.replace('/(root)/(tabs)'); // 직원용 탭으로 이동
      }
      // --- [수정 끝] ---
    } else if (!user && inAppGroup) {
      // 2. 로그아웃 상태인데, 메인 앱 영역에 접근하려고 한다면
      //    -> 로그인 화면으로 강제 이동합니다.
      router.replace('/signIn');
    }

  }, [user, loading, segments]); // user, loading, segments 상태가 변경될 때마다 이 로직을 재실행합니다.

  return <Stack screenOptions={{ headerShown: false }} />;
};

// RootLayout은 AuthProvider로 전체 앱을 감싸는 역할만 합니다.
export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "RobotoSlab-Regular": require("../assets/fonts/RobotoSlab-Regular.ttf"),
    "RobotoSlab-Bold": require("../assets/fonts/RobotoSlab-Bold.ttf"),
    "RobotoSlab-ExtraBold": require("../assets/fonts/RobotoSlab-ExtraBold.ttf"),
    "RobotoSlab-Medium": require("../assets/fonts/RobotoSlab-Medium.ttf"),
    "RobotoSlab-Light": require("../assets/fonts/RobotoSlab-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}