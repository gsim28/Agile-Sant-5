import { useState } from 'react';
import { View, TextInput, Button, Alert, Pressable, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View className="p-4 flex-1 justify-center">
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="mb-4 p-2 border rounded"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="mb-4 p-2 border rounded"
      />
      <Button title="Sign In" onPress={handleLogin} />
      
      <View className="mt-4">
        <Button title="Sign In with Google" onPress={signInWithGoogle} />
        <Button title="Sign In with Apple" onPress={signInWithApple} />
      </View>

      <Pressable
        onPress={() => navigation.navigate('ResetRequest')}
        className="mt-4"
      >
        <Text className="text-blue-500 text-center">Forgot Password?</Text>
      </Pressable>
    </View>
  );
}