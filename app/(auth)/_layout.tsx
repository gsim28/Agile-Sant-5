import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="reset-request" options={{ title: 'Reset Password' }} />
      <Stack.Screen name="reset-password" options={{ title: 'New Password' }} />
    </Stack>
  );
}