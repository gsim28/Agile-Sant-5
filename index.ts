import { registerRootComponent } from 'expo';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';

function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

registerRootComponent(App);