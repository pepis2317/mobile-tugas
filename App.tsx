import 'react-native-reanimated';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
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
import MyShop from './app/screens/MyShop';
import CreateItem from './app/screens/CreateItem';
import EditItem from './app/screens/EditItem';

import AllShop from './app/screens/AllShop'; 
import AllShopItems from './app/screens/AllShopItems';
import CreateShop from './app/screens/CreateShop';
import ChatScreen from './app/screens/ChatScreen';
import Chats from './app/screens/Chats';
import Chat from './app/screens/Chat';


export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  ItemDetail: { item: ItemResponse };
  Chats:undefined
  Chat:{ChatId:string}
  Shop: { shop: ShopResponse };
  CreateItem: { shop: ShopResponse };
  Cart: undefined;
  Orders: undefined;
  MyShop: undefined;
  EditItem: { item: ItemResponse };
  ShopItems: { shopId: string };
  AllShop: undefined; 
  AllShopItems: { shopId: string; userId: string };
  CreateShop: undefined; 
  ChatScreen: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#222831" />
      <Layout />
    </AuthProvider>
  );
}

export function Layout() {
  const { authState } = useAuth();
  const scheme = useColorScheme();
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#222831',
      text: '#ffffff',
    },
  };

  return (
    <NavigationContainer theme={customDarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#222831',
          },
          animation: 'none',
        }}
      >
        {authState?.authenticated ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />

            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{
                headerTitle: 'Profile',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
                headerLeft: () => <></>,
              }}
            />
            <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ headerTitle: '' }} />
            <Stack.Screen name="EditItem" component={EditItem} options={{ headerTitle: '' }} />
            <Stack.Screen name="CreateItem" component={CreateItem} options={{ headerTitle: '' }} />
            <Stack.Screen
              name="Shop"
              component={Shop}
              options={{
                headerTitle: 'Shop',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
              }}
            />
            <Stack.Screen 
                name="CreateShop" 
                component={CreateShop} 
                options={{ headerTitle: "Create Shop" }} 
              />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{
                headerTitle: 'Chat',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
              }}
            />
            <Stack.Screen
              name="Chats"
              component={Chats}
              options={{
                headerTitle: 'Chats',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
              }}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{
                headerTitle: 'Chats',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
              }}
            />


            <Stack.Screen
              name="AllShopItems"
              component={AllShopItems}
              options={{
                headerTitle: 'Shop Items',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
              }}
            />
            <Stack.Screen
              name="MyShop"
              component={MyShop}
              options={{
                headerTitle: 'My Shop',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
              }}
            />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{
                headerTitle: 'Cart',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
                headerLeft: () => <></>,
              }}
            />
            <Stack.Screen
              name="Orders"
              component={Orders}
              options={{
                headerTitle: 'Orders',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
                headerLeft: () => <></>,
              }}
            />
            <Stack.Screen
              name="AllShop"
              component={AllShop}
              options={{
                headerTitle: 'All Shops',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16 },
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
      {authState?.authenticated ? <NavBar /> : null}
    </NavigationContainer>
  );
}
