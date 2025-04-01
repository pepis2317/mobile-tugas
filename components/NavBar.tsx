import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { House, ShoppingCart, Truck, Store,User,Box,MessageCircle} from "lucide-react-native";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

export default function NavBar() {
  const navigation = useNavigation<NavigationType>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <House color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("AllShop")}>
        <Store color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
        <ShoppingCart color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
        <Truck color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("MyShop")}>
        <Box color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ChatScreen")}>
        <MessageCircle color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <User color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#222831",
    width: "100%",
    padding: 15,
    paddingLeft: 25,
    paddingRight: 25,
    bottom: 0,
    elevation: 2,
    borderStyle: "solid",
    borderColor: "#31363F",
    borderTopWidth: 1,
    color: "white",
  },
});
