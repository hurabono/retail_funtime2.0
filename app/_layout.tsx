// 디렉토리: app/_layout.tsx

import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

const InitialLayout = () => {
  const { user, initialized } = useAuth();
  const router = useRouter();
  // [수정] useSegments의 제네릭 타입을 제거합니다.
  const segments = useSegments();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    // [수정] 첫 번째 세그먼트가 문자열임을 타입 단언(as string)하여 확인합니다.
    const inAuthGroup = (segments[0] as string) === 'signIn' || (segments[0] as string) === 'signUp';

    if (user && inAuthGroup) {
      // 로그인 상태이고 인증 페이지(signIn, signUp)에 있다면 메인 탭으로 이동합니다.
      router.replace('/(root)/(tabs)');
    } else if (!user && !inAuthGroup) {
      // 로그인하지 않았고 인증 페이지에 있지 않다면 signIn 페이지로 이동합니다.
      router.replace('/signIn');
    }
  }, [user, initialized, segments, router]);

  return (
      <Stack>
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
      </Stack>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
};

export default RootLayout;