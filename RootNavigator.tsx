import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { Linking } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetRequestScreen from '../screens/ResetRequestScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import EmergencyForm from '../screens/EmergencyForm';
import EmergencyFeed from '../screens/EmergencyFeed';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const linking = {
  prefixes: ['healthcare://', 'https://healthcare-emergency.com'],
  config: {
    screens: {
      ResetPassword: 'reset/:token',
      Home: {
        screens: {
          EmergencyTab: {
            screens: {
              EmergencyFeed: 'feed'
            }
          }
        }
      }
    }
  }
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ResetRequest" component={ResetRequestScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Emergency" component={EmergencyStack} />
    </Tab.Navigator>
  );
}

function EmergencyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmergencyFeed" component={EmergencyFeed} />
      <Stack.Screen name="EmergencyForm" component={EmergencyForm} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="EmergencyFormModal" component={EmergencyForm} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}