// screens/HomeScreen.tsx
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl mb-4">Welcome {user?.email}</Text>
      <Button
        title="Report Emergency"
        onPress={() => navigation.navigate('EmergencyFormModal')}
        color="red"
      />
      <Button
        title="Sign Out"
        onPress={signOut}
        className="mt-4"
      />
    </View>
  );
}