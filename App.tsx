import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import AuthProvider, { useAuth } from './app/context/AuthContext';
import Login from './app/screens/Login';
import Register from './app/screens/Register';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>()
export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export function Layout() {
  const { authState } = useAuth()
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#222831'
    },
  };
  return (
    <NavigationContainer theme={customDarkTheme}>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          </>

        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>

        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}