import 'react-native-reanimated';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import AuthProvider, { useAuth } from './app/context/AuthContext';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import ItemDetail from './app/screens/ItemDetail';
import { ItemResponse } from './models/ItemResponse';
import Shop from './app/screens/Shop';
import { ShopResponse } from './models/ShopResponse';
import NavBar from './components/NavBar';
import Cart from './app/screens/Cart';
import Orders from './app/screens/Orders';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  ItemDetail: { item: ItemResponse };
  Shop: { shop: ShopResponse }
  Cart: undefined
  Orders: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>()
export default function App() {

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Layout />

    </AuthProvider>
  );
}

export function Layout() {
  const { authState } = useAuth()
  const scheme = useColorScheme();
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#222831',
      text: '#ffffff'
    }
  };
  return (
    <NavigationContainer theme={customDarkTheme} >
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#31363F'
        },
      }}>
        {authState?.authenticated ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ headerTitle: "" }} />
            <Stack.Screen name="Shop" component={Shop} options={{ headerTitle: "" }} />
            <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
            <Stack.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
          </>

        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} />
          </>

        )}

      </Stack.Navigator>
      {authState?.authenticated ? <NavBar /> : <></>}
    </NavigationContainer>
  )
}