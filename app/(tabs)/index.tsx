import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome {user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  welcome: {
    fontSize: 20,
    marginBottom: 16
  }
});