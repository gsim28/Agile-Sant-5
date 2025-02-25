// ResetPasswordScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ResetPasswordScreen({ route, navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (route.params?.token) {
      setToken(route.params.token);
    }
  }, [route.params]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      Alert.alert(
        'Password Updated',
        'Your password has been successfully updated',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-red-500 mb-4">Invalid or expired reset link</Text>
        <Button
          title="Back to Login"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 p-5 justify-center">
      <Text className="text-2xl font-bold mb-6">Create New Password</Text>
      
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        className="mb-4 p-3 border rounded"
      />
      
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        className="mb-6 p-3 border rounded"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Reset Password" onPress={handleResetPassword} />
      )}
    </View>
  );
}