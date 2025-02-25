// ResetRequestScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ResetRequestScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetRequest = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for password reset instructions',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5 justify-center">
      <Text className="text-2xl font-bold mb-6">Reset Password</Text>
      <Text className="mb-4 text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="mb-4 p-3 border rounded"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Send Reset Link" onPress={handleResetRequest} />
      )}

      <Button
        title="Back to Login"
        onPress={() => navigation.navigate('Login')}
        color="gray"
      />
    </View>
  );
}